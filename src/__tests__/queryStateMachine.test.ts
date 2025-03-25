import { QueryState, stateTransitions } from '../queryStateMachine';

describe('queryStateMachine Module', () => {
  const states: QueryState[] = [
    'BroadOverview',
    'Refinement',
    'Comparison',
    'ExpertDetail',
    'FinalSynthesis',
  ];

  test('stateTransitions has correct keys for all states', () => {
    states.forEach((state) => {
      expect(stateTransitions).toHaveProperty(state);
      expect(Array.isArray(stateTransitions[state])).toBe(true);
    });
  });

  test('FinalSynthesis has no outgoing transitions', () => {
    expect(stateTransitions.FinalSynthesis).toEqual([]);
  });

  test('Valid transitions from BroadOverview', () => {
    const transitions = stateTransitions.BroadOverview;
    expect(transitions).toContain('Refinement');
    expect(transitions).toContain('Comparison');
    expect(transitions.length).toBe(2);
  });

  test('Valid transitions from Refinement', () => {
    const transitions = stateTransitions.Refinement;
    expect(transitions).toContain('Comparison');
    expect(transitions).toContain('ExpertDetail');
    expect(transitions.length).toBe(2);
  });

  test('Valid transitions from Comparison', () => {
    const transitions = stateTransitions.Comparison;
    expect(transitions).toContain('ExpertDetail');
    expect(transitions).toContain('Refinement');
    expect(transitions.length).toBe(2);
  });

  test('Valid transitions from ExpertDetail', () => {
    const transitions = stateTransitions.ExpertDetail;
    expect(transitions).toContain('FinalSynthesis');
    expect(transitions).toContain('Comparison');
    expect(transitions.length).toBe(2);
  });

  test('All transitions point to valid states', () => {
    Object.values(stateTransitions).forEach(transitions => {
      transitions.forEach(nextState => {
        expect(states).toContain(nextState);
      });
    });
  });
});
