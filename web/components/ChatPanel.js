"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

export default function ChatPanel({ sources }) {
  const [messages, setMessages] = useState(sources.length ? [{ role: "system", content: "Ask a question about your uploaded PDF." }] : []);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  async function onSend(e) {
    e.preventDefault();
    const content = input.trim();
    if (!content) return;

    const userMessage = { role: "user", content };
    setMessages((m) => [...m, userMessage]);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.answer || "No answer returned." }]);

    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", content: "Something went wrong." }]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-semibold text-orange-400">ChaiBookLM</h1>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-2xl px-4 py-3 rounded-2xl ${m.role === "user" ? "bg-orange-500 text-white" : "bg-gray-800 text-white"}`}>
                {m.content}
              </div>
            </div>
          ))}

          {pending && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-gray-300 px-4 py-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ask anything about your PDF..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={pending}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(e); } }}
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
            />
            <button
              onClick={onSend}
              disabled={pending || !input.trim()}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
