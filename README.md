ChaiBookLM

ChaiBookLM is an AI-powered document chat application that allows users to upload, index, and interact with their documents through a conversational interface. Built with Next.js, Tailwind CSS, and integrated with QdrantDB for efficient vector-based search, ChaiBookLM offers an intuitive way to extract insights from your documents.

🚀 Live Demo

Experience the application live at: https://chai-book-lm.vercel.app/

📦 Features

Document Upload: Upload PDF or TXT files.

Text Input: Paste long-form text directly into the application.

Indexing: Automatically indexes uploaded documents or pasted text for efficient searching.

Chat Interface: Engage in a conversation with your documents to extract information.

Source Management: View and manage indexed sources in the sidebar.

Responsive Design: Optimized for both desktop and mobile devices.

🛠️ Technologies Used

Frontend: Next.js, React, Tailwind CSS

Backend: Node.js

Database: QdrantDB (hosted on AWS)

Deployment: Vercel

🔧 Setup Instructions
Prerequisites

Node.js (v16 or higher)

npm or yarn

QdrantDB account (for vector search functionality)

Installation

Clone the repository:

git clone https://github.com/dev-d-25/ChaiBookLM.git
cd ChaiBookLM


Install dependencies:

npm install


Create a .env file in the root directory and add your QdrantDB API key:

QDRANT_API_KEY=your_qdrant_api_key


Run the development server:

npm run dev


The application will be available at http://localhost:3000
.

🧪 Usage

Upload a Document: Click on the "Upload" button in the sidebar to select a file from your device.

Enter Text: Switch to the "Text" tab to paste your content directly.

Process Content: Click on the "Process" button to upload or process the content.

Index Content: After processing, click on "Index Content" to make the document searchable.

Chat: Ask questions related to the uploaded document in the chat interface.

📄 API Endpoints

POST /api/upload: Uploads a document file.

POST /api/process: Processes the uploaded document or pasted text.

POST /api/index: Indexes the processed content in QdrantDB.

POST /api/chat: Sends a query to the indexed content and retrieves a response.
