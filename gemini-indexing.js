// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import fetch from "node-fetch"; // make sure it's installed: npm i node-fetch
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  try {
    const url =
      "https://ik.imagekit.io/nk42behcdu/3150703-Analysis_and_Design_of_Algorithms_hLgyYG1hN.pdf?updatedAt=1755606742025";
    console.log("🔗 Received PDF URL:", url);

    // Step 1: Fetch PDF as Blob
    console.log("📥 Fetching PDF...");
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "application/pdf" });

    // Step 2: Load PDF with WebPDFLoader
    console.log("📖 Parsing PDF...");
    const loader = new WebPDFLoader(blob);
    const docs = await loader.load();
    console.log(`✅ PDF loaded. Extracted ${docs.length} documents`);

    // Step 3: Embeddings setup
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "models/embedding-001",
    });
    console.log("⚡ Embeddings model initialized");

    // Step 4: Index in Qdrant
    await QdrantVectorStore.fromDocuments(docs, embeddings, {
      url: process.env.QDRANT_URL || "http://localhost:6333",
      collectionName: "notebookllm",
    });

    console.log("🎉 Indexing complete, vector store ready!");
  } catch (err) {
    console.error("❌ Indexing failed:", err);
  }
}

main();
