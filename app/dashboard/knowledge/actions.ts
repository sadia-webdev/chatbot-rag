"use server";

import { embedMany } from "ai";
import { embeddingModel } from "@/lib/embeddings";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

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

  console.log("Embedding length:", result.embeddings.length);
  console.log("First 10 numbers:", result.embeddings.slice(0, 10));
}
