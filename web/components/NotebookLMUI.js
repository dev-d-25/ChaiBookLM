"use client";

import { useState } from "react";
import UploadPanel from "./UploadPanel";
import ChatPanel from "./ChatPanel";

export default function NotebookLMUI() {
  const [sources, setSources] = useState([]);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  return (
    <div className="flex h-screen bg-black text-white">
      <UploadPanel
        sources={sources}
        setSources={setSources}
        uploadedUrl={uploadedUrl}
        setUploadedUrl={setUploadedUrl}
        setUploadMessage={setUploadMessage}
      />
      <ChatPanel sources={sources} />
    </div>
  );
}
