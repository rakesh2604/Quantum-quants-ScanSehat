import { openai } from "./openaiService";

export const buildEmbedding = async (text: string) => {
  if (!text.trim()) return [];
  const response = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: text
  });
  return response.data[0].embedding;
};

export const cosineSimilarity = (a: number[], b: number[]) => {
  const dot = a.reduce((sum, val, idx) => sum + val * (b[idx] ?? 0), 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return !normA || !normB ? 0 : dot / (normA * normB);
};
