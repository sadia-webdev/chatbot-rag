import { embed } from "ai";
import { embeddingModel } from "@/lib/embeddings";
import { index } from "@/lib/pinecone";



export async function searchDocuments(query: string, businessId: string) {

const SIMILARITY_THRESHOLD = 0.7;

  const { embedding } = await embed({
    model: embeddingModel,
    value: query,
  });

  const results = await index.query({
    vector: embedding,
    topK: 3,
    includeMetadata: true,
    filter: {
      businessId: {
        $eq: businessId,
      },
    },
  });

  return results.matches.filter(
    (match) => (match.score ?? 0) >= SIMILARITY_THRESHOLD,
  );
}
