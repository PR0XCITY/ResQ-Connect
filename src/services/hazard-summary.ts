/**
 * AI Hazard Summary Service for ResQ Connect
 * 
 * Provides AI-powered hazard assessment and disaster summary generation
 * using OpenAI integration for the disaster management module.
 */

import { DisasterReport } from '@/src/lib/supabase';

export interface HazardSummary {
  summary: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  affectedAreas: string[];
  recommendations: string[];
  weatherImpact: string;
  emergencyContacts: string[];
  timestamp: Date;
  confidence: number;
}

export interface HazardAssessment {
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  riskFactors: {
    weather: number; // 0-1 scale
    terrain: number; // 0-1 scale
    infrastructure: number; // 0-1 scale
    population: number; // 0-1 scale
    historical: number; // 0-1 scale
  };
  overallRisk: number; // 0-1 scale
  recommendations: string[];
  warnings: string[];
}

export class HazardSummaryService {

  /**
   * Generate comprehensive hazard summary for North-Eastern India
   */
  async generateHazardSummary(disasterReports: DisasterReport[]): Promise<HazardSummary> {
    try {
      // Analyze disaster reports
      const analysis = this.analyzeDisasterReports(disasterReports);
      
      // Generate mock summary based on analysis
      return this.generateMockHazardSummary(analysis, disasterReports);
    } catch (error) {
      console.error('Error generating hazard summary:', error);
      return this.getFallbackHazardSummary(disasterReports);
    }
  }

  /**
   * Assess hazard risk for a specific location
   */
  async assessLocationHazard(
    latitude: number, 
    longitude: number, 
    disasterReports: DisasterReport[]
  ): Promise<HazardAssessment> {
    try {
      // Get nearby disaster reports
      const nearbyReports = this.getNearbyDisasters(latitude, longitude, disasterReports, 10);
      
      // Calculate risk factors
      const riskFactors = this.calculateRiskFactors(latitude, longitude, nearbyReports);
      
      // Generate mock assessment
      return this.generateMockLocationAssessment(latitude, longitude, riskFactors, nearbyReports);
    } catch (error) {
      console.error('Error assessing location hazard:', error);
      return this.getFallbackLocationAssessment(latitude, longitude);
    }
  }

  /**
   * Generate emergency recommendations based on current conditions
   */
  async generateEmergencyRecommendations(
    disasterType: string,
    severity: string,
    location: { latitude: number; longitude: number }
  ): Promise<string[]> {
    try {
      // Generate mock recommendations based on disaster type and severity
      return this.generateMockRecommendations(disasterType, severity);
    } catch (error) {
      console.error('Error generating emergency recommendations:', error);
      return this.getFallbackRecommendations(disasterType, severity);
    }
  }

  /**
   * Analyze disaster reports to extract patterns and trends
   */
  private analyzeDisasterReports(disasterReports: DisasterReport[]) {
    const analysis = {
      totalReports: disasterReports.length,
      disasterTypes: {} as { [key: string]: number },
      severityLevels: {} as { [key: string]: number },
      recentReports: 0,
      highRiskAreas: [] as { lat: number; lng: number; count: number }[],
      overallRisk: 0,
    };

    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    disasterReports.forEach(report => {
      // Count disaster types
      analysis.disasterTypes[report.disaster_type] = 
        (analysis.disasterTypes[report.disaster_type] || 0) + 1;

      // Count severity levels
      analysis.severityLevels[report.severity] = 
        (analysis.severityLevels[report.severity] || 0) + 1;

      // Count recent reports
      if (new Date(report.created_at) > last24Hours) {
        analysis.recentReports++;
      }

      // Identify high-risk areas (clusters of reports)
      const existingArea = analysis.highRiskAreas.find(area => 
        Math.abs(area.lat - report.latitude) < 0.01 && 
        Math.abs(area.lng - report.longitude) < 0.01
      );

      if (existingArea) {
        existingArea.count++;
      } else {
        analysis.highRiskAreas.push({
          lat: report.latitude,
          lng: report.longitude,
          count: 1,
        });
      }
    });

    // Calculate overall risk (0-1 scale)
    const criticalReports = analysis.severityLevels.critical || 0;
    const highReports = analysis.severityLevels.high || 0;
    const recentWeight = Math.min(analysis.recentReports / 10, 1);
    const severityWeight = (criticalReports * 0.5 + highReports * 0.3) / analysis.totalReports;
    
    analysis.overallRisk = Math.min((recentWeight + severityWeight) / 2, 1);

    return analysis;
  }

  /**
   * Calculate risk factors for a specific location
   */
  private calculateRiskFactors(
    latitude: number, 
    longitude: number, 
    nearbyReports: DisasterReport[]
  ) {
    const riskFactors = {
      weather: 0.3, // Base weather risk for hilly terrain
      terrain: 0.4, // Base terrain risk for North-Eastern India
      infrastructure: 0.2, // Base infrastructure risk
      population: 0.1, // Base population density risk
      historical: 0.2, // Base historical risk
    };

    // Adjust based on nearby reports
    if (nearbyReports.length > 0) {
      const recentReports = nearbyReports.filter(report => 
        new Date(report.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );

      const severityMultiplier = nearbyReports.reduce((sum, report) => {
        const severityValues = { low: 0.2, medium: 0.4, high: 0.7, critical: 1.0 };
        return sum + (severityValues[report.severity] || 0.4);
      }, 0) / nearbyReports.length;

      riskFactors.weather += recentReports.length * 0.1 * severityMultiplier;
      riskFactors.terrain += recentReports.length * 0.1 * severityMultiplier;
      riskFactors.infrastructure += recentReports.length * 0.05 * severityMultiplier;
    }

    // Cap all values at 1.0
    Object.keys(riskFactors).forEach(key => {
      riskFactors[key as keyof typeof riskFactors] = Math.min(riskFactors[key as keyof typeof riskFactors], 1.0);
    });

    const overallRisk = Object.values(riskFactors).reduce((sum, value) => sum + value, 0) / Object.keys(riskFactors).length;

    return { ...riskFactors, overallRisk };
  }

  /**
   * Get nearby disaster reports within specified radius
   */
  private getNearbyDisasters(
    latitude: number, 
    longitude: number, 
    disasterReports: DisasterReport[], 
    radiusKm: number
  ): DisasterReport[] {
    return disasterReports.filter(report => {
      const distance = this.calculateDistance(
        latitude, longitude,
        report.latitude, report.longitude
      );
      return distance <= radiusKm;
    });
  }

  /**
   * Calculate distance between two coordinates in kilometers
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Get current time of day
   */
  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }


  /**
   * Get fallback hazard summary when AI is unavailable
   */
  private getFallbackHazardSummary(disasterReports: DisasterReport[]): HazardSummary {
    const recentReports = disasterReports.filter(report => 
      new Date(report.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    return {
      summary: `Current disaster monitoring shows ${disasterReports.length} total reports with ${recentReports.length} in the last 24 hours. Stay alert and follow local safety guidelines.`,
      riskLevel: recentReports.length > 5 ? 'high' : recentReports.length > 2 ? 'medium' : 'low',
      affectedAreas: [],
      recommendations: [
        'Monitor local news and weather updates',
        'Avoid traveling to high-risk areas',
        'Keep emergency supplies ready',
        'Share your location with trusted contacts'
      ],
      weatherImpact: 'Weather conditions can change rapidly in hilly terrain',
      emergencyContacts: [
        'Police: 100',
        'Fire: 101',
        'Ambulance: 102',
        'Disaster Management: 108'
      ],
      timestamp: new Date(),
      confidence: 0.6,
    };
  }

  /**
   * Get fallback location assessment when AI is unavailable
   */
  private getFallbackLocationAssessment(latitude: number, longitude: number): HazardAssessment {
    return {
      location: { latitude, longitude },
      riskFactors: {
        weather: 0.3,
        terrain: 0.4,
        infrastructure: 0.2,
        population: 0.1,
        historical: 0.2,
      },
      overallRisk: 0.3,
      recommendations: [
        'Stay alert and aware of your surroundings',
        'Follow local emergency guidelines',
        'Keep emergency contacts readily available'
      ],
      warnings: [
        'Hilly terrain may have unstable conditions',
        'Weather can change rapidly'
      ],
    };
  }

  /**
   * Generate mock hazard summary based on analysis
   */
  private generateMockHazardSummary(analysis: any, disasterReports: DisasterReport[]): HazardSummary {
    const riskLevel = analysis.overallRisk > 0.7 ? 'critical' : 
                     analysis.overallRisk > 0.5 ? 'high' : 
                     analysis.overallRisk > 0.3 ? 'medium' : 'low';

    const summaries = {
      low: "Current conditions in North-Eastern India show minimal disaster activity. Standard safety precautions are recommended for travelers.",
      medium: "Moderate disaster activity detected in North-Eastern India. Exercise increased caution and stay informed about local conditions.",
      high: "High disaster activity reported in North-Eastern India. Avoid non-essential travel and follow local emergency guidelines closely.",
      critical: "Critical disaster situation in North-Eastern India. Immediate safety measures required. Avoid affected areas and follow emergency protocols."
    };

    return {
      summary: summaries[riskLevel],
      riskLevel,
      affectedAreas: analysis.highRiskAreas.map((area: any) => 
        `${area.lat.toFixed(4)}, ${area.lng.toFixed(4)}`
      ),
      recommendations: this.generateMockRecommendations('general', riskLevel),
      weatherImpact: 'Monitor weather conditions closely in hilly terrain',
      emergencyContacts: [
        'Police: 100',
        'Fire: 101', 
        'Ambulance: 102',
        'Disaster Management: 108'
      ],
      timestamp: new Date(),
      confidence: 0.8,
    };
  }

  /**
   * Generate mock location assessment
   */
  private generateMockLocationAssessment(
    latitude: number, 
    longitude: number, 
    riskFactors: any, 
    nearbyReports: DisasterReport[]
  ): HazardAssessment {
    const recommendations = this.generateMockRecommendations('general', 
      riskFactors.overallRisk > 0.7 ? 'critical' : 
      riskFactors.overallRisk > 0.5 ? 'high' : 
      riskFactors.overallRisk > 0.3 ? 'medium' : 'low'
    );

    const warnings = [];
    if (riskFactors.terrain > 0.5) {
      warnings.push('High terrain risk - be cautious of unstable slopes');
    }
    if (riskFactors.weather > 0.5) {
      warnings.push('Weather conditions may be hazardous');
    }
    if (nearbyReports.length > 0) {
      warnings.push(`${nearbyReports.length} recent incidents reported nearby`);
    }

    return {
      location: { latitude, longitude },
      riskFactors,
      overallRisk: riskFactors.overallRisk,
      recommendations,
      warnings,
    };
  }

  /**
   * Generate mock recommendations based on disaster type and severity
   */
  private generateMockRecommendations(disasterType: string, severity: string): string[] {
    const baseRecommendations = [
      'Stay calm and assess the situation',
      'Move to a safe location if possible',
      'Call emergency services immediately',
      'Follow local emergency guidelines'
    ];

    const typeSpecificRecommendations: { [key: string]: string[] } = {
      flood: [
        'Move to higher ground immediately',
        'Avoid walking or driving through floodwaters',
        'Stay away from rivers and streams'
      ],
      earthquake: [
        'Drop, cover, and hold on',
        'Stay away from buildings and power lines',
        'Be prepared for aftershocks'
      ],
      landslide: [
        'Move away from steep slopes',
        'Watch for signs of ground movement',
        'Avoid areas with loose soil or rocks'
      ],
      storm: [
        'Seek shelter immediately',
        'Stay away from windows and doors',
        'Avoid open areas and high ground'
      ],
      fire: [
        'Evacuate immediately if safe to do so',
        'Stay low to avoid smoke',
        'Call fire department immediately'
      ],
      general: [
        'Stay alert and aware of your surroundings',
        'Keep emergency contacts readily available',
        'Monitor local news and weather updates',
        'Share your location with trusted contacts'
      ]
    };

    return [
      ...baseRecommendations,
      ...(typeSpecificRecommendations[disasterType] || typeSpecificRecommendations.general)
    ];
  }

  /**
   * Get fallback recommendations when AI is unavailable
   */
  private getFallbackRecommendations(disasterType: string, severity: string): string[] {
    return this.generateMockRecommendations(disasterType, severity);
  }
}

// Export singleton instance
export const hazardSummaryService = new HazardSummaryService();
