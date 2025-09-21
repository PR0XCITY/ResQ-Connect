/**
 * Tests for OpenAI Client Service
 * 
 * These tests verify the AI service functionality including fallback responses
 * and proper error handling when the OpenAI API is unavailable.
 */

import { OpenAIClient, createTestClient, SafetyContext } from '../openai-client';

describe('OpenAIClient', () => {
  let testClient: OpenAIClient;

  beforeEach(() => {
    testClient = createTestClient();
  });

  describe('generateSafetyAdvice', () => {
    it('should return fallback response for unsafe walking query', async () => {
      const query = 'I feel unsafe walking alone';
      const response = await testClient.generateSafetyAdvice(query);

      expect(response).toMatchObject({
        text: expect.stringContaining('Safety Tips for Traveling Alone'),
        confidence: 0.6,
        fallback: true,
        timestamp: expect.any(Date)
      });
      expect(response.text).toContain('North-Eastern India');
      expect(response.text).toContain('hilly terrain');
    });

    it('should return fallback response for emergency query', async () => {
      const query = 'I need emergency help';
      const response = await testClient.generateSafetyAdvice(query);

      expect(response).toMatchObject({
        text: expect.stringContaining('Emergency Response'),
        confidence: 0.7,
        fallback: true,
        timestamp: expect.any(Date)
      });
      expect(response.text).toContain('100 (Police)');
      expect(response.text).toContain('101 (Fire)');
      expect(response.text).toContain('102 (Ambulance)');
    });

    it('should return generic fallback for other queries', async () => {
      const query = 'What is the weather like?';
      const response = await testClient.generateSafetyAdvice(query);

      expect(response).toMatchObject({
        text: expect.stringContaining('ResQ Connect'),
        confidence: 0.5,
        fallback: true,
        timestamp: expect.any(Date)
      });
      expect(response.text).toContain('travel safety assistant');
    });

    it('should include context information when provided', async () => {
      const query = 'I need help';
      const context: SafetyContext = {
        location: {
          latitude: 26.1445,
          longitude: 91.7362,
          address: 'Guwahati, Assam'
        },
        timeOfDay: 'night',
        weather: 'rainy',
        emergencyLevel: 'high'
      };

      const response = await testClient.generateSafetyAdvice(query, context);

      expect(response.fallback).toBe(true);
      expect(response.text).toContain('ResQ Connect');
    });
  });

  describe('generateEmergencyMessage', () => {
    it('should generate medical emergency message', async () => {
      const context: SafetyContext = {
        location: {
          latitude: 26.1445,
          longitude: 91.7362,
          address: 'Guwahati, Assam'
        }
      };

      const response = await testClient.generateEmergencyMessage('medical', context);

      expect(response).toMatchObject({
        text: expect.stringContaining('MEDICAL EMERGENCY'),
        confidence: 0.8,
        fallback: true,
        timestamp: expect.any(Date)
      });
      expect(response.text).toContain('102 for ambulance');
      expect(response.text).toContain('Guwahati, Assam');
    });

    it('should generate safety emergency message', async () => {
      const context: SafetyContext = {
        location: {
          latitude: 26.1445,
          longitude: 91.7362,
          address: 'Shillong, Meghalaya'
        }
      };

      const response = await testClient.generateEmergencyMessage('safety', context);

      expect(response).toMatchObject({
        text: expect.stringContaining('SAFETY EMERGENCY'),
        confidence: 0.8,
        fallback: true,
        timestamp: expect.any(Date)
      });
      expect(response.text).toContain('100 for police');
      expect(response.text).toContain('Shillong, Meghalaya');
    });

    it('should generate weather emergency message', async () => {
      const context: SafetyContext = {
        location: {
          latitude: 26.1445,
          longitude: 91.7362,
          address: 'Kohima, Nagaland'
        }
      };

      const response = await testClient.generateEmergencyMessage('weather', context);

      expect(response).toMatchObject({
        text: expect.stringContaining('WEATHER EMERGENCY'),
        confidence: 0.8,
        fallback: true,
        timestamp: expect.any(Date)
      });
      expect(response.text).toContain('seek immediate shelter');
      expect(response.text).toContain('Kohima, Nagaland');
    });

    it('should generate transport emergency message', async () => {
      const context: SafetyContext = {
        location: {
          latitude: 26.1445,
          longitude: 91.7362,
          address: 'Aizawl, Mizoram'
        }
      };

      const response = await testClient.generateEmergencyMessage('transport', context);

      expect(response).toMatchObject({
        text: expect.stringContaining('TRANSPORT EMERGENCY'),
        confidence: 0.8,
        fallback: true,
        timestamp: expect.any(Date)
      });
      expect(response.text).toContain('move to safety');
      expect(response.text).toContain('Aizawl, Mizoram');
    });
  });

  describe('assessRouteSafety', () => {
    it('should return route safety assessment', async () => {
      const route = {
        start: { lat: 26.1445, lon: 91.7362 },
        end: { lat: 26.2000, lon: 91.8000 },
        waypoints: [{ lat: 26.1725, lon: 91.7681 }]
      };

      const response = await testClient.assessRouteSafety(route);

      expect(response).toMatchObject({
        text: expect.stringContaining('Route Safety Assessment'),
        confidence: 0.6,
        fallback: true,
        timestamp: expect.any(Date)
      });
      expect(response.text).toContain('hilly terrain');
      expect(response.text).toContain('weather conditions');
      expect(response.text).toContain('North-Eastern India');
    });

    it('should include context in route assessment', async () => {
      const route = {
        start: { lat: 26.1445, lon: 91.7362 },
        end: { lat: 26.2000, lon: 91.8000 }
      };

      const context: SafetyContext = {
        weather: 'rainy',
        timeOfDay: 'night',
        emergencyLevel: 'medium'
      };

      const response = await testClient.assessRouteSafety(route, context);

      expect(response.fallback).toBe(true);
      expect(response.text).toContain('Route Safety Assessment');
    });
  });

  describe('error handling', () => {
    it('should handle missing API key gracefully', async () => {
      const client = new OpenAIClient();
      const response = await client.generateSafetyAdvice('test query');

      expect(response.fallback).toBe(true);
      expect(response.text).toContain('ResQ Connect');
    });

    it('should handle API errors gracefully', async () => {
      // Mock fetch to simulate API error
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const client = new OpenAIClient('valid-key');
      const response = await client.generateSafetyAdvice('test query');

      expect(response.fallback).toBe(true);
      expect(response.text).toContain('fallback response');

      // Restore original fetch
      global.fetch = originalFetch;
    });
  });

  describe('response format', () => {
    it('should always return valid response format', async () => {
      const response = await testClient.generateSafetyAdvice('test');

      expect(response).toHaveProperty('text');
      expect(response).toHaveProperty('confidence');
      expect(response).toHaveProperty('fallback');
      expect(response).toHaveProperty('timestamp');

      expect(typeof response.text).toBe('string');
      expect(typeof response.confidence).toBe('number');
      expect(typeof response.fallback).toBe('boolean');
      expect(response.timestamp).toBeInstanceOf(Date);
    });

    it('should have confidence scores in valid range', async () => {
      const response = await testClient.generateSafetyAdvice('test');

      expect(response.confidence).toBeGreaterThanOrEqual(0);
      expect(response.confidence).toBeLessThanOrEqual(1);
    });
  });
});

describe('createTestClient', () => {
  it('should create client in test mode', () => {
    const client = createTestClient();
    expect(client).toBeInstanceOf(OpenAIClient);
  });
});
