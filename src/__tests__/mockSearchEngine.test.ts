import { mockSearchEngine } from '../mockSearchEngine';

describe('mockSearchEngine Module', () => {
  test('mockSearchEngine returns results with correct structure', async () => {
    const query = 'Test search query';
    const results = await mockSearchEngine(query);

    expect(results).toHaveProperty('relevanceScore');
    expect(results).toHaveProperty('snippet');
    expect(typeof results.relevanceScore).toBe('number');
    expect(typeof results.snippet).toBe('string');
  });

  test('relevanceScore is between 0 and 1', async () => {
    const query = 'Another test query';
    const results = await mockSearchEngine(query);

    expect(results.relevanceScore).toBeGreaterThanOrEqual(0);
    expect(results.relevanceScore).toBeLessThanOrEqual(1);
  });

  test('snippet contains part of the query', async () => {
    const query = 'Testing mock search engine snippet';
    const results = await mockSearchEngine(query);

    expect(results.snippet).toContain(query.slice(0, 60));
  });

  test('handles empty query', async () => {
    const query = '';
    const results = await mockSearchEngine(query);

    expect(results.relevanceScore).toBeGreaterThanOrEqual(0);
    expect(results.relevanceScore).toBeLessThanOrEqual(1);
    expect(results.snippet).toBe('Snippet for "" indicating partial coverage.');
  });

  test('handles very long query', async () => {
    const query = 'a'.repeat(100);
    const results = await mockSearchEngine(query);

    expect(results.snippet).toContain(query.slice(0, 60));
    expect(results.snippet).toContain('...');
  });
});
