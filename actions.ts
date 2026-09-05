"use server";
import { google } from "@ai-sdk/google";
import { embed, generateText } from "ai";
import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pc.index("rag-documents");

export async function aploadFile(formData: FormData) {
  const file = formData.get("file") as File;

  const { PDFLoader } =
    await import("@langchain/community/document_loaders/fs/pdf");

  const blob = new Blob([await file.arrayBuffer()], {
    type: "application/pdf",
  });

  const loader = new PDFLoader(blob);

  const documents = await loader.load();

  const { RecursiveCharacterTextSplitter } =
    await import("@langchain/textsplitters");


  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
  });

  const chunks = await splitter.splitDocuments(documents);

  const records = [];

  for (let i = 0; i < chunks.length; i++) {
    const text = chunks[i].pageContent;

    const { embedding } = await embed({
      model: google.embedding("gemini-embedding-001"),
      value: text,
    });

    records.push({
      id: `chunk-${i + 1}`,
      values: embedding,
      metadata: {
        text,
      },
    });
  }

  await index.upsert(records);
}

export async function searchDocuments(formData: FormData) {

  const query = formData.get("query") as string


  const { embedding: queryEmbedding } = await embed({
    model: google.embedding("gemini-embedding-001"),
    value: query,
  });

 
  const results = await index.query({
    vector: queryEmbedding,
    topK: 2,
    includeMetadata: true,
  });

const context = results.matches
  .map((match) => match.metadata?.text)
  .filter(Boolean)
  .join("\n");


  console.log(results.matches[0].metadata);
  console.log(results.matches[1].metadata);


  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `
    Answer the user's question using only the context below.

    Context:
    ${context}

    Question:
    ${query}
  `,
  });

  console.log(text);

}

