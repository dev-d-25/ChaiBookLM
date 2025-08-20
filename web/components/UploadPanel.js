"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

export default function UploadPanel({ sources, setSources, setUploadedUrl, uploadedUrl, setUploadMessage }) {
  const [file, setFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const [inputMode, setInputMode] = useState("file"); // "file" or "text"

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage("");
  };

  const handleUpload = async () => {
    if (inputMode === "file" && !file) {
      setUploadMessage("⚠️ No file selected.");
      return;
    }
    if (inputMode === "text" && !textInput.trim()) {
      setUploadMessage("⚠️ No text entered.");
      return;
    }

    setLoading(true);
    setUploadMessage("Processing...");

    try {
      if (inputMode === "file") {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          setUploadedUrl(data.url);
        } else {
          setUploadMessage("❌ Upload failed.");
        }
      } else {
        // Handle text input as a source
        const res = await fetch("/api/index", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: textInput }),
        });
        const data = await res.json();
        if (data.message) {
          setUploadedUrl(`/text/${Date.now()}`);
        } else {
          setUploadMessage("❌ Indexing text failed.");
        }
      }

      setUploadMessage("✅ Content processed successfully!");
    } catch (err) {
      setUploadMessage("❌ Processing failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleIndex = async () => {
    if (!uploadedUrl) {
      setUploadMessage("⚠️ Upload a file or enter text first.");
      return;
    }

    setIndexing(true);
    setUploadMessage("Indexing...");

    try {
      const res = await fetch("/api/index", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: inputMode === "file" ? uploadedUrl : null,
          text: inputMode === "text" ? textInput : null,
        }),
      });
      const data = await res.json();

      setSources([{
        name: inputMode === "file" ? file.name : "Text Input",
        type: inputMode,
        status: "indexed"
      }]);
      setUploadMessage("✅ Content indexed successfully!");
    } catch (err) {
      setUploadMessage("❌ Indexing failed.");
    } finally {
      setIndexing(false);
    }
  };

  return (
    <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-orange-400 mb-4">Sources</h2>
      </div>

      {/* Sources Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {sources.length === 0 ? (
          <div className="text-center text-gray-400 mt-8 space-y-4">
            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-gray-600" />
            </div>
            <p className="text-sm mb-2">Saved sources will appear here</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Add PDFs or enter text directly to use as a source.
            </p>

            {/* Input Mode Toggle */}
            <div className="flex bg-gray-800 rounded-lg p-1 mt-4">
              <button
                onClick={() => setInputMode("file")}
                className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                  inputMode === "file" 
                    ? "bg-orange-500 text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                📁 File
              </button>
              <button
                onClick={() => setInputMode("text")}
                className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                  inputMode === "text" 
                    ? "bg-orange-500 text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                📝 Text
              </button>
            </div>

            {/* File Input */}
            {inputMode === "file" && (
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-500 file:text-white hover:file:bg-orange-600 file:cursor-pointer mt-3"
                accept=".pdf,.doc,.docx,.txt"
              />
            )}

            {/* Text Input */}
            {inputMode === "text" && (
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste your text content here..."
                className="w-full h-32 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-orange-500 transition-colors mt-3"
              />
            )}

            <button
              onClick={handleUpload}
              disabled={loading || (inputMode === "file" ? !file : !textInput.trim())}
              className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium mt-3"
            >
              {loading ? "Processing..." : `Process ${inputMode === "file" ? "File" : "Text"}`}
            </button>

            <button
              onClick={handleIndex}
              disabled={!uploadedUrl || indexing}
              className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium mt-2"
            >
              {indexing ? "Indexing..." : "Index Content"}
            </button>

            {setUploadMessage && (
              <p className="text-xs text-center text-gray-400 mt-2">{setUploadMessage}</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {sources.map((source, i) => (
              <div key={i} className="p-3 bg-gray-800 rounded-lg border border-orange-500/20">
                <div className="flex items-center gap-2">
                  {source.type === "text" ? (
                    <div className="w-4 h-4 bg-yellow-500 rounded text-xs flex items-center justify-center text-black font-bold">T</div>
                  ) : (
                    <FileText size={16} className="text-orange-400" />
                  )}
                  <span className="text-sm truncate">{source.name}</span>
                </div>
                <div className="text-xs text-green-400 mt-1">✓ Content indexed successfully!</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
