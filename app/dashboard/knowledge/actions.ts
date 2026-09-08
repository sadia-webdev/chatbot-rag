"use server";

import { embedMany } from "ai";
import { embeddingModel } from "@/lib/embeddings";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { index } from "../../../lib/pinecone";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { business } from "@/db/schema";


export async function uploadDocument(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw new Error("No file uploaded");
  }

  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }

  const { PDFLoader } =
    await import("@langchain/community/document_loaders/fs/pdf");

  // Convert File to Blob for LangChain
  const blob = new Blob([await file.arrayBuffer()], {
    type: "application/pdf",
  });

  // Create PDF loader with blob
  const loader = new PDFLoader(blob);

  // Load and parse the PDF
  const documents = await loader.load();

  // Combine all pages into single text
  let fullText = "";

  documents.forEach((document, index) => {
    if (document.pageContent.trim()) {
      fullText += `\n\nPage ${index + 1}:\n${document.pageContent.trim()}`;
    }
  });

  if (!fullText.trim()) {
    return `No text content could be extracted from ${file.name}. The PDF might be image-based or encrypted.`;
  }

  const { RecursiveCharacterTextSplitter } =
    await import("@langchain/textsplitters");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    separators: [
      "\n\n\n", // Paragraph breaks
      "\n\n", // Double line breaks
      "\n", // Single line breaks
      ". ", // Sentence endings
      " ", // Word boundaries
      "", // Character level (last resort)
    ],
  });

  const chunks = await splitter.splitDocuments(documents);

  const result = await embedMany({
    model: embeddingModel,
    values: chunks.map((chunk) => chunk.pageContent),
  });


  const userBusiness = await db
    .select()
    .from(business)
    .where(eq(business.userId, session.user.id))
    .limit(1);

  if (userBusiness.length === 0) {
    throw new Error("Business not found");
  }

  const currentBusiness = userBusiness[0];

const records = chunks.map((chunk, index) => ({
  id: crypto.randomUUID(),
  values: result.embeddings[index],
  metadata: {
    businessId: currentBusiness.id,
    text: chunk.pageContent,
  },
}));

await index.upsert(records);

console.log(`Uploaded ${records.length} vectors to Pinecone`);


  const stats = await index.describeIndexStats();

  console.log("Pinecone stats:", stats);
}
