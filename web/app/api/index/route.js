import { NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document } from "langchain/document";
import fetch from "node-fetch";
import "dotenv/config";

export async function POST(req) {
  try {
    const { url, text } = await req.json();

    let docs = [];

    if (url) {
      // Fetch PDF from URL
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      const buffer = Buffer.from(await response.arrayBuffer());

      // Convert Buffer to Blob
      const pdfBlob = new Blob([buffer], { type: "application/pdf" });

      // Load PDF from Blob
      const loader = new PDFLoader(pdfBlob);
      docs = await loader.load();
    } else if (text) {
      // Handle text input
      docs = [
        new Document({ pageContent: text, metadata: { source: "text-input" } }),
      ];
    } else {
      return NextResponse.json(
        { error: "No PDF URL or text provided" },
        { status: 400 }
      );
    }

    // Initialize embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "models/embedding-001",
    });

    // Save to Qdrant
    await QdrantVectorStore.fromDocuments(docs, embeddings, {
      url: process.env.QDRANT_URL || "http://localhost:6333",
      collectionName: "notebookllm",
    });

    return NextResponse.json({
      message: "Indexing successful",
      totalDocs: docs.length,
    });
  } catch (err) {
    console.error("Indexing error:", err);
    return NextResponse.json(
      { error: "Indexing failed", details: err.message },
      { status: 500 }
    );
  }
}
