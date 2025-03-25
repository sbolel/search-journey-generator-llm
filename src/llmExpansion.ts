/**
 * llmExpansion.ts
 *
 * Uses the newer OpenAI v4+ library to refine or expand a given query.
 * We import OpenAI as a default export, then call its .chat.completions.create() method.
 */

import * as dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import { type ChatCompletionMessageParam } from "openai/resources/chat/completions/completions";
import { Persona } from "./personas";

enum MODELS {
  GPT_4O = "gpt-4o",
  GPT_4O_MINI_SEARCH = "gpt-4o-mini-search-preview",
  GPT_O1 = "o1",
  GPT_O1_MINI = "o1-mini",
  GPT_O3 = "o3",
  GPT_O3_MINI = "o3-mini",
}

const MODEL = MODELS.GPT_4O;
const WORD_LIMIT = 20;
const MAX_TOKENS = 150;
const TEMPERATURE = 0.7;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generates a fresh query from the last query context, factoring in persona differences.
 *
 * @param topic           The overarching topic (e.g., "Educational Technology").
 * @param lastQuery       The user’s last query in the chain.
 * @param usedExpansions  A set of previously used strings/phrases.
 * @param persona         The persona object to shape style or depth.
 * @returns               A brand new short query that logically follows the last query but doesn't repeat.
 */
export async function getAIExpansion(
  topic: string,
  lastQuery: string,
  usedExpansions: Set<string>,
  persona: Persona
): Promise<string> {
  // We incorporate "usedExpansions" to steer the LLM away from repeating them.
  const expansionsList = Array.from(usedExpansions).join("; ");

  /**
   * We’ll craft more persona-aware instructions:
   * For instance, a "CasualResearcher" might want shorter queries, a friendlier tone,
   * a "InDepthAnalyst" might prefer more advanced vocabulary, deeper subtopics, etc.
   */
  let personaHint = "";
  if (persona.name === "CasualResearcher") {
    personaHint = `
- You are casual and concise.
- Produce queries that are somewhat informal, short, and easy to grasp.
- Stick to simpler or trending subtopics.
- Emulate the natural thought process of a casual researcher user.
    `;
  } else if (persona.name === "InDepthAnalyst") {
    personaHint = `
- You are very analytical, detail-oriented, and formal.
- Produce queries that dive into deeper technical or comparative aspects.
- Feel free to use more advanced terminology and dive into niche subtopics.
- Emulate the natural thought process of an in-depth analyst user with prior knowledge.
    `;
  } else {
    personaHint = `
- General user style.
- It's okay to produce moderate detail.
- Emulate the natural thought process of a typical user, not too casual or too formal.
- Feel free to explore various subtopics or angles.
    `;
  }

  const systemPrompt = `
You are a helpful assistant rewriting a user's search query to focus on a new angle or subtopic.
Key rules:
- Do NOT wrap the query in quotes.
- Do NOT enclose expansions in parentheses.
- Do NOT repeat phrases from previous queries.
- Keep the query relatively short (max ~${WORD_LIMIT} words).
- Each response must be a complete, standalone search query.
- Avoid copying large chunks of the last query. It's OK to reuse a few key terms from the topic.
- No function-calling or extra JSON; just return the new query text.
${personaHint}
`;

  const userPrompt = `
TOPIC: "${topic}"
PREVIOUS QUERY: "${lastQuery}"
USED EXPANSIONS: [${expansionsList}]

Rewrite the query with a new subtopic or detail.
Do not repeat phrases from previous queries.
Return only the new query text.
`;

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE
    });

    const [choice] = response.choices || [];
    if (!choice?.message?.content) {
      return "";
    }

    const newQuery = choice.message.content.trim();

    return newQuery;
  } catch (error) {
    console.error("Error in getAIExpansion:", error);
    return "";
  }
}
