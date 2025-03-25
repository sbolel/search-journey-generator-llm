/**
 * mockSearchEngine.ts
 *
 * Simulates how a search engine might respond to a given query.
 * Returns:
 *   - relevanceScore: a pseudo-random measure of how good/accurate results are
 *   - snippet: a short snippet that "represents" the top result
 */

export interface SearchResults {
  relevanceScore: number; // 0.0 (no results) -> 1.0 (perfect match)
  snippet: string;
}

/**
 * Mocks a search engine response by producing:
 *   - a random score
 *   - a snippet that includes a piece of the query
 */
export async function mockSearchEngine(query: string): Promise<SearchResults> {
  // In a real scenario, you'd call an actual search API or knowledge base,
  // parse the results, and derive a meaningful "score".
  // Here, we just randomize a score to simulate success/failure.
  const relevanceScore = Math.random(); // 0 to 1

  // Produce a snippet referencing part of the query
  const snippet = `Snippet for "${query.slice(0, 60)}..." indicating partial coverage.`;

  // Return a promise that resolves with a simulated object
  return { relevanceScore, snippet };
}
