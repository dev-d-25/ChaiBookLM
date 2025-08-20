import { NextResponse } from "next/server";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function POST(request) {
  try {
    const body = await request.json();
    const messages = body?.messages || [];
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const question = lastUser?.content?.trim();

    if (!question)
      return NextResponse.json({ answer: "Ask a question to begin." });

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "models/embedding-001",
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: process.env.QDRANT_URL, // updated
        collectionName: "notebookllm",
        apiKey: process.env.QDRANT_API_KEY,
      }
    );
    const vectorRetriever = vectorStore.asRetriever({ k: 3 });
    const relevantDocs = await vectorRetriever.getRelevantDocuments(question);

    const contextText = relevantDocs
      .map((doc) => `Page ${doc.metadata?.page || "?"}: ${doc.pageContent}`)
      .join("\n\n");

    const SYSTEM_PROMPT = `
      You are an AI assistant. Answer questions ONLY based on the provided PDF content.and text content also provide page number refrence if it is from pdf file
      including page reference and use text output only dont use markdown
      Context:
      ${contextText}
      `;

    const response = await client.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: question },
      ],
    });

    const answer =
      response.choices?.[0]?.message?.content || "No answer returned.";
    return NextResponse.json({ answer });
  } catch (err) {
    return NextResponse.json({
      answer: "Something went wrong.",
      error: err.message,
    });
  }
}
