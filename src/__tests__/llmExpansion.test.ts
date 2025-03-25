import { getAIExpansion } from '../llmExpansion';
import { Persona } from '../personas';

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: 'Mocked AI expansion query',
                },
              },
            ],
          }),
        },
      },
    };
  });
});

describe('llmExpansion Module', () => {
  const mockPersona: Persona = {
    name: 'TestPersona',
    maxQueries: 3,
    commonExpansions: ['expansion1', 'expansion2'],
  };

  test('getAIExpansion returns a non-empty string', async () => {
    const result = await getAIExpansion(
      'Artificial Intelligence',
      'Latest AI trends',
      new Set(['previous expansion']),
      mockPersona
    );
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  test('getAIExpansion does not repeat used expansions', async () => {
    const usedExpansions = new Set(['previous expansion']);
    const result = await getAIExpansion(
      'Artificial Intelligence',
      'Latest AI trends',
      usedExpansions,
      mockPersona
    );
    usedExpansions.forEach((expansion) => {
      expect(result).not.toContain(expansion);
    });
  });

  test('handles different personas correctly', async () => {
    const casualPersona: Persona = {
      name: 'CasualResearcher',
      maxQueries: 3,
      commonExpansions: [],
    };
    
    const analyticalPersona: Persona = {
      name: 'InDepthAnalyst',
      maxQueries: 5,
      commonExpansions: [],
    };
    
    const casualResult = await getAIExpansion(
      'Technology',
      'Latest tech trends',
      new Set(),
      casualPersona
    );
    
    const analyticalResult = await getAIExpansion(
      'Technology',
      'Latest tech trends',
      new Set(),
      analyticalPersona
    );
    
    expect(casualResult).toBe('Mocked AI expansion query');
    expect(analyticalResult).toBe('Mocked AI expansion query');
  });

  test('handles API errors gracefully', async () => {
    // Temporarily override the mock to simulate an error
    const originalMock = require('openai');
    jest.mock('openai', () => {
      return jest.fn().mockImplementation(() => {
        return {
          chat: {
            completions: {
              create: jest.fn().mockRejectedValue(new Error('API Error')),
            },
          },
        };
      });
    });
    
    const result = await getAIExpansion(
      'Error Test',
      'This should handle errors',
      new Set(),
      mockPersona
    );
    
    expect(result).toBe('');
    
    // Restore the original mock
    jest.mock('openai', () => originalMock);
  });
});
