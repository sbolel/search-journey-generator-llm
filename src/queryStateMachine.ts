/**
 * queryStateMachine.ts
 *
 * A simplified state machine that outlines how a user's research journey might progress.
 */

export type QueryState =
  | 'BroadOverview'
  | 'Refinement'
  | 'Comparison'
  | 'ExpertDetail'
  | 'FinalSynthesis';

/**
 * Defines permissible transitions between states:
 *   - "BroadOverview" -> can refine or compare
 *   - "Refinement" -> can compare or move to deeper detail
 *   - "Comparison" -> might lead to detail or back to more refinement
 *   - "ExpertDetail" -> can finalize or continue comparing
 *   - "FinalSynthesis" -> end of the journey
 */
export const stateTransitions: Record<QueryState, QueryState[]> = {
  BroadOverview: ['Refinement', 'Comparison'],
  Refinement: ['Comparison', 'ExpertDetail'],
  Comparison: ['ExpertDetail', 'Refinement'],
  ExpertDetail: ['FinalSynthesis', 'Comparison'],
  FinalSynthesis: [],
};
