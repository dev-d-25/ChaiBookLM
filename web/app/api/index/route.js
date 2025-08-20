import { NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import fetch from "node-fetch";
import { Document } from "langchain/document";
import "dotenv/config";

export async function POST(req) {
  try {
    const { url, text } = await req.json();
    let docs = [];

    if (url) {
      // Fetch PDF as buffer
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      const buffer = Buffer.from(await response.arrayBuffer());

      // Load PDF directly from buffer
      const loader = new PDFLoader(buffer, { splitPages: true });
      docs = await loader.load();
    } else if (text) {
      // Convert text input into a document
      docs = [
        new Document({ pageContent: text, metadata: { source: "text-input" } }),
      ];
    } else {
      return NextResponse.json(
        { error: "No PDF URL or text provided" },
        { status: 400 }
      );
    }

    // Create embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "models/embedding-001",
    });

    // Save to Qdrant
    await QdrantVectorStore.fromDocuments(docs, embeddings, {
      url: process.env.QDRANT_URL, // Cloud Qdrant URL
      apiKey: process.env.QDRANT_API_KEY, // If your Qdrant requires an API key
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
