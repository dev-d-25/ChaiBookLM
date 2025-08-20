import { NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { Document } from "langchain/document";
import "dotenv/config"

export async function POST(req) {
  try {
    const { url, text } = await req.json();

    let docs = [];

    if (url) {
      // Download PDF to temp file
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      const buffer = Buffer.from(await response.arrayBuffer());

      const tmpFilePath = path.join(process.cwd(), "temp.pdf");
      fs.writeFileSync(tmpFilePath, buffer);

      const loader = new PDFLoader(tmpFilePath);
      docs = await loader.load();

      fs.unlinkSync(tmpFilePath);
    } else if (text) {
      // Convert text input into a document
      docs = [new Document({ pageContent: text, metadata: { source: "text-input" } })];
    } else {
      return NextResponse.json({ error: "No PDF URL or text provided" }, { status: 400 });
    }

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "models/embedding-001",
    });

    await QdrantVectorStore.fromDocuments(docs, embeddings, {
      url: process.env.QDRANT_URL || "http://localhost:6333",
      collectionName: "notebookllm",
    });

    return NextResponse.json({ message: "Indexing successful", totalDocs: docs.length });
  } catch (err) {
    return NextResponse.json({ error: "Indexing failed", details: err.message }, { status: 500 });
  }
}
