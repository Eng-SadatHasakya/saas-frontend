import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am your AI assistant. Ask me anything about your organization.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.push("/login"); return; }

    // ✅ Connect WebSocket
    const ws = new WebSocket(`ws://localhost:8000/ws?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "AI_THINKING") {
        setLoading(true);
      }

      if (data.type === "AI_RESPONSE_READY") {
        setLoading(false);
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: data.data.response
        }]);
      }
    };

    ws.onclose = () => setConnected(false);

    return () => ws.close();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "ai_query",
        content: input
      }));
    }

    setInput("");
    setLoading(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQueries = [
    "How many users are in my organization?",
    "What is my current subscription plan?",
    "Summarize my organization",
    "Who are the admins?",
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="text-xl font-bold text-indigo-400">AI Assistant</div>
          <span className={`text-xs px-2 py-1 rounded-full ${connected ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
            {connected ? "● Live" : "○ Disconnected"}
          </span>
        </div>
        <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm transition">
          Back to Dashboard
        </Link>
      </nav>

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 flex flex-col">

        {messages.length === 1 && (
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-3">Suggested questions:</p>
            <div className="grid grid-cols-2 gap-2">
              {suggestedQueries.map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="bg-gray-900 border border-gray-700 hover:border-indigo-600 rounded-lg px-4 py-3 text-sm text-left text-gray-300 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 space-y-4 mb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xl px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-sm"
                  : "bg-gray-800 text-gray-100 rounded-bl-sm"
              }`}>
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-indigo-400 text-xs font-bold">AI</span>
                  </div>
                )}
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your organization..."
            rows={1}
            className="flex-1 bg-gray-800 border border-gray-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim() || !connected}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 px-5 py-3 rounded-xl text-sm font-medium transition"
          >
            Send
          </button>
        </div>
        <p className="text-gray-600 text-xs text-center mt-2">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}