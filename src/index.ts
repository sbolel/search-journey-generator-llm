/**
 * index.ts
 *
 * Entry point to run the user-journey generator logic with feedback.
 * Demonstrates how different personas adapt their queries based on success/failure.
 */

import { topics } from './topics';
import { generateQuerySequence } from './userJourneyGenerator';
import { casualResearcher, inDepthAnalyst, genericUser } from './personas';

async function main() {
  const chosenTopic = topics[Math.floor(Math.random() * topics.length)];
  const initialQuery = `${chosenTopic} updates 2025`;

  console.log(`\n=== Generating queries for topic: "${chosenTopic}" ===\n`);

  // Casual
  console.log('----- Casual Researcher Queries -----');
  const casualQueries = await generateQuerySequence(
    chosenTopic,
    initialQuery,
    casualResearcher
  );
  casualQueries.forEach((q, idx) => console.log(`${idx + 1}. ${q}`));

  // In-Depth
  console.log('\n----- In-Depth Analyst Queries -----');
  const inDepthQueries = await generateQuerySequence(
    chosenTopic,
    initialQuery,
    inDepthAnalyst
  );
  inDepthQueries.forEach((q, idx) => console.log(`${idx + 1}. ${q}`));

  console.log('\n----- In-Depth Analyst Queries -----');
  const genericQueries = await generateQuerySequence(
    chosenTopic,
    initialQuery,
    genericUser
  );
  genericQueries.forEach((q, idx) => console.log(`${idx + 1}. ${q}`));
}

main().catch(console.error);
