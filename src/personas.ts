/**
 * personas.ts
 *
 * Defines different user personas that affect:
 *   - Maximum number of queries in a session
 *   - Typical expansions or approach to refining queries
 */

export interface Persona {
  /** Label for the persona */
  name: string;
  /** Maximum number of queries this persona might generate */
  maxQueries: number;
  /** Common expansions or refinements used by this persona */
  commonExpansions: string[];
}

export const casualResearcher: Persona = {
  name: 'CasualResearcher',
  maxQueries: 10,
  commonExpansions: [
    'basic overview',
    'recent trends',
    'related topics',
    'quick tips',
    'introductory information',
  ],
};

export const inDepthAnalyst: Persona = {
  name: 'InDepthAnalyst',
  maxQueries: 10,
  commonExpansions: [
    'detailed review',
    'comparative study',
    'expert perspectives',
    'market analysis',
    'competitors',
    'future projections',
    'case studies',
  ],
};

export const genericUser: Persona = {
  name: 'GenericUser',
  maxQueries: 10,
  commonExpansions: [
    'overview',
    'details',
    'comparisons',
    'pros and cons',
    'reviews',
    'recommendations',
  ],
};
