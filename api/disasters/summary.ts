/**
 * AI Hazard Summary API Endpoint
 * 
 * Provides AI-generated hazard summaries for disaster management
 * using OpenAI integration on the backend.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { hazardSummaryService } from '@/src/services/hazard-summary';
import { supabase } from '@/src/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get disaster reports from database
    const { data: disasterReports, error } = await supabase
      .from('disaster_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching disaster reports:', error);
      return res.status(500).json({ error: 'Failed to fetch disaster reports' });
    }

    // Generate AI hazard summary
    const summary = await hazardSummaryService.generateHazardSummary(disasterReports || []);

    // Return the summary
    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Error generating hazard summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate hazard summary',
    });
  }
}
