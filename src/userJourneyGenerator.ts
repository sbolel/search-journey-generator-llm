/**
 * userJourneyGenerator.ts
 */
import { Persona } from './personas';
import { QueryState, stateTransitions } from './queryStateMachine';
import { getAIExpansion } from './llmExpansion';
import { mockSearchEngine } from './mockSearchEngine';

export async function generateQuerySequence(
  initialTopic: string,
  initialQuery: string,
  persona: Persona
): Promise<string[]> {
  let currentState: QueryState = 'BroadOverview';
  let currentQuery: string = initialQuery;
  const usedExpansions: Set<string> = new Set([initialQuery]);

  const queries: string[] = [];

  for (let i = 0; i < persona.maxQueries; i++) {
    queries.push(currentQuery);

    const { relevanceScore } = await mockSearchEngine(currentQuery);

    let feedbackCategory: 'success' | 'partial' | 'failure';
    if (relevanceScore >= 0.7) feedbackCategory = 'success';
    else if (relevanceScore >= 0.3) feedbackCategory = 'partial';
    else feedbackCategory = 'failure';

    const nextStates: QueryState[] = stateTransitions[currentState];

    if (nextStates.length === 0) break;

    // Simple logic to pick next state
    if (feedbackCategory === 'success') {
      if (
        nextStates.includes('ExpertDetail') &&
        currentState !== 'ExpertDetail'
      ) {
        currentState = 'ExpertDetail';
      } else if (nextStates.includes('FinalSynthesis')) {
        currentState = 'FinalSynthesis';
      } else {
        currentState =
          nextStates[Math.floor(Math.random() * nextStates.length)];
      }
    } else if (feedbackCategory === 'partial') {
      if (nextStates.includes('Comparison') && currentState !== 'Comparison') {
        currentState = 'Comparison';
      } else {
        currentState =
          nextStates[Math.floor(Math.random() * nextStates.length)];
      }
    } else {
      // feedbackCategory === "failure"
      if (nextStates.includes('Refinement') && currentState !== 'Refinement') {
        currentState = 'Refinement';
      } else {
        currentState =
          nextStates[Math.floor(Math.random() * nextStates.length)];
      }
    }

    // Here we no longer forcibly add persona expansions with parentheses.
    // Instead, we let the LLM do the rewriting based on the persona style.

    // Generate a new query with the updated system & user prompts
    const newQuery = await getAIExpansion(
      initialTopic,
      currentQuery,
      usedExpansions,
      persona
    );

    // If it returned empty, end
    if (!newQuery) break;

    // Mark it as used, so we avoid repeating the entire new query text in the future
    usedExpansions.add(newQuery);
    // Move on
    currentQuery = newQuery;

    // If we just changed to FinalSynthesis, we might do one last iteration
    if (currentState === 'FinalSynthesis' && i < persona.maxQueries - 1) {
      // next iteration might produce the final query
    }
  }

  return queries;
}
