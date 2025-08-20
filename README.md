# ChaiBookLM

ChaiBookLM is an **AI-powered document chat application** that allows users to upload, index, and interact with their documents through a conversational interface.  

Built with **Next.js, Tailwind CSS, Google Generative AI Embeddings, and QdrantDB**, it enables fast semantic search and retrieval-augmented chat over your PDFs and text notes.

Live Demo 👉 [https://chai-book-lm.vercel.app/](https://chai-book-lm.vercel.app/)  
GitHub Repo 👉 [https://github.com/dev-d-25/ChaiBookLM](https://github.com/dev-d-25/ChaiBookLM)

---

## ✨ Features

- 📂 **Upload PDFs** and index them into QdrantDB. (PDF MAX SIZE - 5 MB)
- 📝 **Add text notes** directly (indexed as well).  
- 🤖 **Chat with your documents** using Google Generative AI.  
- ⚡ **Semantic search** with embeddings for fast retrieval.  
- 🎨 **Frontend built with Next.js + Tailwind CSS** for a clean, responsive UI.  
- ☁️ **Deployed on Vercel** with cloud-hosted QdrantDB.

---

## Tech Stack

- Frontend: Next.js, Tailwind CSS

- Embeddings: Google Generative AI

- Vector DB: QdrantDB

- Deployment: Vercel

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/dev-d-25/ChaiBookLM.git
cd ChaiBookLM
```

2. Install Dependencies
 ```bash
npm install
```

4. Setup Environment Variables

Create a .env.local file in the root of your project:

GEMINI_API_KEY=your_google_gemini_api_key
QDRANT_URL=https://YOUR-QDRANT-ENDPOINT:6333
QDRANT_API_KEY=your_qdrant_api_key  

4. Run Development Server
npm run dev

Visit http://localhost:3000

🛠 API Endpoints
/api/upload -> Handles file uploads (PDFs).

/api/index -> Indexes PDFs or text into QdrantDB.

/api/chat -> Handles user chat queries, retrieves relevant chunks from Qdrant, and generates AI-powered responses.

