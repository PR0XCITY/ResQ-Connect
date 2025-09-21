/**
 * OpenAI Client Service for ResQ Connect
 * 
 * This service provides a model-agnostic interface for AI-powered safety assistance.
 * It includes fallback responses for offline scenarios and test mocking capabilities.
 */

export interface AIResponse {
  text: string;
  confidence: number;
  fallback: boolean;
  timestamp: Date;
}

export interface SafetyContext {
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  weather?: 'clear' | 'rainy' | 'foggy' | 'stormy';
  userLanguage?: 'en' | 'hi' | 'as' | 'bn'; // English, Hindi, Assamese, Bengali
  emergencyLevel?: 'low' | 'medium' | 'high' | 'critical';
}

export class OpenAIClient {
  private apiKey: string | null = null;
  private baseUrl: string = 'https://api.openai.com/v1';
  private model: string = 'gpt-3.5-turbo';
  private isTestMode: boolean = false;

  constructor(apiKey?: string, testMode: boolean = false) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || null;
    this.isTestMode = testMode;
  }

  /**
   * Generate safety advice based on user query and context
   */
  async generateSafetyAdvice(
    query: string, 
    context?: SafetyContext
  ): Promise<AIResponse> {
    if (this.isTestMode || !this.apiKey) {
      return this.getFallbackResponse(query, context);
    }

    try {
      const response = await this.callOpenAI(query, context);
      return {
        text: response,
        confidence: 0.9,
        fallback: false,
        timestamp: new Date()
      };
    } catch (error) {
      console.warn('OpenAI API call failed, using fallback:', error);
      return this.getFallbackResponse(query, context);
    }
  }

  /**
   * Generate emergency message in multiple languages
   */
  async generateEmergencyMessage(
    emergencyType: 'medical' | 'safety' | 'weather' | 'transport',
    context: SafetyContext
  ): Promise<AIResponse> {
    const query = `Generate a clear, concise emergency message for ${emergencyType} situation in North-Eastern India. Include location details and immediate actions needed.`;
    
    if (this.isTestMode || !this.apiKey) {
      return this.getEmergencyFallback(emergencyType, context);
    }

    try {
      const response = await this.callOpenAI(query, context);
      return {
        text: response,
        confidence: 0.95,
        fallback: false,
        timestamp: new Date()
      };
    } catch (error) {
      console.warn('OpenAI API call failed, using emergency fallback:', error);
      return this.getEmergencyFallback(emergencyType, context);
    }
  }

  /**
   * Assess route safety for travel in hilly terrain
   */
  async assessRouteSafety(
    route: {
      start: { lat: number; lon: number };
      end: { lat: number; lon: number };
      waypoints?: Array<{ lat: number; lon: number }>;
    },
    context?: SafetyContext
  ): Promise<AIResponse> {
    const query = `Assess the safety of this travel route in North-Eastern India considering weather, terrain, and local conditions.`;
    
    if (this.isTestMode || !this.apiKey) {
      return this.getRouteSafetyFallback(route, context);
    }

    try {
      const response = await this.callOpenAI(query, context);
      return {
        text: response,
        confidence: 0.85,
        fallback: false,
        timestamp: new Date()
      };
    } catch (error) {
      console.warn('OpenAI API call failed, using route safety fallback:', error);
      return this.getRouteSafetyFallback(route, context);
    }
  }

  /**
   * Make actual OpenAI API call
   */
  private async callOpenAI(query: string, context?: SafetyContext): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not provided');
    }

    const systemPrompt = this.buildSystemPrompt(context);
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query }
    ];

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Unable to generate response';
  }

  /**
   * Build system prompt based on context
   */
  private buildSystemPrompt(context?: SafetyContext): string {
    let prompt = `You are ResQ Connect, an AI safety assistant for travelers in North-Eastern India. 
    Provide clear, actionable safety advice focused on hilly terrain, weather conditions, and local context.
    Always prioritize immediate safety and emergency response.`;

    if (context?.userLanguage) {
      const languageNames = {
        'en': 'English',
        'hi': 'Hindi', 
        'as': 'Assamese',
        'bn': 'Bengali'
      };
      prompt += ` Respond in ${languageNames[context.userLanguage]}.`;
    }

    if (context?.emergencyLevel === 'critical') {
      prompt += ` This is a CRITICAL emergency situation. Provide immediate, life-saving advice.`;
    }

    return prompt;
  }

  /**
   * Get fallback response when API is unavailable
   */
  private getFallbackResponse(query: string, context?: SafetyContext): AIResponse {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('unsafe') || lowerQuery.includes('walking alone')) {
      return {
        text: `**Safety Tips for Traveling Alone in North-Eastern India:**

🚶‍♀️ **Stay Alert & Aware**
- Keep your head up and avoid distractions
- Trust your instincts - if something feels wrong, it probably is
- Be extra cautious in hilly terrain and during weather changes

🌟 **Choose Safe Routes**
- Use well-lit, populated areas whenever possible
- Avoid shortcuts through isolated mountain paths
- Check weather conditions before traveling

📱 **Stay Connected**
- Share your location with trusted contacts
- Keep your phone charged and easily accessible
- Use ResQ Connect's emergency alert if you feel threatened

👥 **Be Prepared**
- Walk with purpose and confidence
- Avoid displaying expensive items
- If possible, travel with others or in groups

**Note: This is a fallback response. For real-time AI assistance, ensure your internet connection is stable.**`,
        confidence: 0.6,
        fallback: true,
        timestamp: new Date()
      };
    }

    if (lowerQuery.includes('emergency') || lowerQuery.includes('help')) {
      return {
        text: `**Emergency Response - North-Eastern India:**

🚨 **Immediate Actions**
- Call local emergency services: 100 (Police), 101 (Fire), 102 (Ambulance)
- Use ResQ Connect's emergency alert feature
- Move to a safe, public location if possible

📍 **Location Sharing**
- Share your exact location with emergency contacts
- Provide landmarks or nearby buildings for reference
- Stay put unless it's safer to move

📱 **Communication**
- Keep your phone charged and accessible
- Send your location via GPS coordinates
- Use ResQ Connect's community alerts to notify nearby users

**Note: This is a fallback response. For real-time AI assistance, ensure your internet connection is stable.**`,
        confidence: 0.7,
        fallback: true,
        timestamp: new Date()
      };
    }

    return {
      text: `Thank you for your question! I'm ResQ Connect, your travel safety assistant for North-Eastern India.

I can help with:
- Personal safety advice for hilly terrain
- Emergency response guidance
- Route safety assessment
- Weather-related safety tips
- Local emergency contacts

**Note: This is a fallback response. For real-time AI assistance, ensure your internet connection is stable.**

How can I assist you with your safety concerns?`,
      confidence: 0.5,
      fallback: true,
      timestamp: new Date()
    };
  }

  /**
   * Get emergency fallback response
   */
  private getEmergencyFallback(emergencyType: string, context?: SafetyContext): AIResponse {
    const emergencyMessages = {
      medical: `🚨 MEDICAL EMERGENCY - North-Eastern India
Location: ${context?.location?.address || 'Current location'}
Time: ${new Date().toLocaleString()}

Immediate Actions:
1. Call 102 for ambulance
2. Stay with the person
3. Keep them comfortable and still
4. Share location with emergency contacts

ResQ Connect Emergency Alert Activated`,
      
      safety: `🚨 SAFETY EMERGENCY - North-Eastern India
Location: ${context?.location?.address || 'Current location'}
Time: ${new Date().toLocaleString()}

Immediate Actions:
1. Call 100 for police
2. Move to a safe, public location
3. Stay alert and aware
4. Share location with trusted contacts

ResQ Connect Emergency Alert Activated`,
      
      weather: `🌧️ WEATHER EMERGENCY - North-Eastern India
Location: ${context?.location?.address || 'Current location'}
Time: ${new Date().toLocaleString()}

Immediate Actions:
1. Seek immediate shelter
2. Avoid open areas and high ground
3. Stay away from water bodies
4. Monitor weather updates

ResQ Connect Emergency Alert Activated`,
      
      transport: `🚗 TRANSPORT EMERGENCY - North-Eastern India
Location: ${context?.location?.address || 'Current location'}
Time: ${new Date().toLocaleString()}

Immediate Actions:
1. Move to safety if possible
2. Call 100 for police assistance
3. Document the incident
4. Share location with emergency contacts

ResQ Connect Emergency Alert Activated`
    };

    return {
      text: emergencyMessages[emergencyType] || emergencyMessages.safety,
      confidence: 0.8,
      fallback: true,
      timestamp: new Date()
    };
  }

  /**
   * Get route safety fallback response
   */
  private getRouteSafetyFallback(route: any, context?: SafetyContext): AIResponse {
    return {
      text: `**Route Safety Assessment - North-Eastern India**

⚠️ **General Safety Considerations:**
- Hilly terrain may have steep inclines and sharp turns
- Weather conditions can change rapidly
- Some areas may have limited mobile connectivity
- Wildlife may be present in forested areas

✅ **Safety Recommendations:**
- Travel during daylight hours when possible
- Inform someone of your planned route and expected arrival time
- Carry emergency supplies and first aid kit
- Check weather conditions before departure
- Use ResQ Connect's location sharing feature

**Note: This is a fallback assessment. For real-time route analysis, ensure your internet connection is stable.**`,
      confidence: 0.6,
      fallback: true,
      timestamp: new Date()
    };
  }
}

// Export singleton instance
export const openaiClient = new OpenAIClient();

// Export for testing
export const createTestClient = () => new OpenAIClient('test-key', true);
