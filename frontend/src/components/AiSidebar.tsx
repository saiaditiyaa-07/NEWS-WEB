"use client";

import React, { useState } from "react";
import { 
  Sparkles, BrainCircuit, HelpCircle, 
  Send, Bot, User, CheckCircle2, ChevronRight, BarChart3, AlertCircle 
} from "lucide-react";

interface AiSidebarProps {
  articleId: string;
  aiSummary: string;
  keyTakeaways: string[];
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
    label: string;
  };
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function AiSidebar({ articleId, aiSummary, keyTakeaways, sentiment }: AiSidebarProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "chat">("summary");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatError, setChatError] = useState("");

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage.trim();
    setChatMessage("");
    setChatError("");
    setChatHistory((prev) => [...prev, { role: "user", content: userText }]);
    setIsTyping(true);

    try {
      const historyPayload = chatHistory.map(c => ({
        role: c.role,
        content: c.content
      }));

      const res = await fetch(`http://127.0.0.1:8000/api/articles/${articleId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history: historyPayload })
      });

      if (!res.ok) throw new Error("Failed to reach cognitive model");

      const data = await res.json();
      
      const fullAnswer = data.answer;
      let typedAnswer = "";
      setIsTyping(false);
      
      setChatHistory((prev) => [...prev, { role: "assistant", content: "" }]);

      const words = fullAnswer.split(" ");
      let wordIdx = 0;

      const timer = setInterval(() => {
        if (wordIdx < words.length) {
          typedAnswer += (wordIdx === 0 ? "" : " ") + words[wordIdx];
          setChatHistory((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: typedAnswer };
            return updated;
          });
          wordIdx++;
        } else {
          clearInterval(timer);
        }
      }, 40);

    } catch (err) {
      setIsTyping(false);
      setChatError("Could not retrieve AI response. Verify backend server status.");
    }
  };

  return (
    <aside className="w-full lg:w-[360px] flex flex-col gap-6 shrink-0 text-gray-900">
      
      {/* Tab Toggles */}
      <div className="flex p-1 rounded bg-gray-100 border border-gray-200">
        <button
          onClick={() => setActiveTab("summary")}
          className={`flex-1 py-2 px-3 text-[10px] font-black uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "summary"
              ? "bg-white text-[#003366] border border-gray-200 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>AI Insight Panel</span>
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-2 px-3 text-[10px] font-black uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "chat"
              ? "bg-white text-[#003366] border border-gray-200 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Cognitive Assistant</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "summary" ? (
        <div className="space-y-6">
          {/* AI Executive Summary Card */}
          <div className="p-5 rounded border border-blue-200 bg-[#eff6ff] shadow-sm">
            <h4 className="text-[10px] font-black tracking-widest uppercase text-[#003366] flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#d60000]" />
              <span>AI Executive Synthesis</span>
            </h4>
            <p className="text-xs font-semibold text-gray-700 leading-relaxed">
              {aiSummary}
            </p>
          </div>

          {/* Key Takeaways Card */}
          <div className="p-5 rounded border border-gray-200 bg-white shadow-sm">
            <h4 className="text-[10px] font-black tracking-widest uppercase text-gray-900 flex items-center gap-1.5 mb-4">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#d60000]" />
              <span>Core Takeaways</span>
            </h4>
            <ul className="space-y-3.5">
              {keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex gap-2.5 items-start text-xs font-semibold text-gray-600 leading-normal">
                  <ChevronRight className="w-3.5 h-3.5 text-[#003366] shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sentiment Gauge Card */}
          <div className="p-5 rounded border border-gray-200 bg-white space-y-4 shadow-sm">
            <h4 className="text-[10px] font-black tracking-widest uppercase text-gray-900 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-[#d60000]" />
              <span>Sentiment Analysis</span>
            </h4>

            {/* Gauge breakdown */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-gray-500">
                <span>Signal Label</span>
                <span className="text-[#003366] font-extrabold uppercase">{sentiment.label}</span>
              </div>
              
              {/* Stacked Sentiment Ratio Bar */}
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden flex">
                <div style={{ width: `${sentiment.positive}%` }} className="bg-emerald-500" title={`Positive: ${sentiment.positive}%`} />
                <div style={{ width: `${sentiment.neutral}%` }} className="bg-gray-400" title={`Neutral: ${sentiment.neutral}%`} />
                <div style={{ width: `${sentiment.negative}%` }} className="bg-rose-500" title={`Negative: ${sentiment.negative}%`} />
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[9px] font-black text-center">
                <div className="bg-emerald-100 text-emerald-700 py-1 rounded">
                  POS {sentiment.positive}%
                </div>
                <div className="bg-gray-100 text-gray-600 py-1 rounded">
                  NEU {sentiment.neutral}%
                </div>
                <div className="bg-rose-100 text-rose-700 py-1 rounded">
                  NEG {sentiment.negative}%
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Chat Widget Interface */
        <div className="rounded border border-gray-200 bg-white flex flex-col h-[400px] overflow-hidden shadow-sm">
          
          {/* Info Banner */}
          <div className="p-3 bg-gray-50 border-b border-gray-200 text-[9px] font-black tracking-widest uppercase text-gray-500 flex items-center gap-1.5 shrink-0">
            <HelpCircle className="w-3.5 h-3.5 text-[#003366]" />
            <span>Inquire About This Report</span>
          </div>

          {/* Conversation Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 px-6 space-y-2">
                <Bot className="w-8 h-8 text-gray-300 animate-pulse" />
                <p className="font-extrabold text-xs text-gray-700">Cognitive Terminal Ready</p>
                <p className="text-[10px]">Ask about the findings, timelines, figures, or the author of this article.</p>
              </div>
            ) : (
              chatHistory.map((chat, idx) => (
                <div key={idx} className={`flex gap-2.5 ${chat.role === "user" ? "justify-end" : "justify-start"}`}>
                  
                  {chat.role === "assistant" && (
                    <div className="p-1 h-6 w-6 rounded bg-[#eff6ff] text-[#003366] flex items-center justify-center shrink-0 border border-blue-200">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`p-3 rounded font-semibold leading-relaxed max-w-[80%] border ${
                    chat.role === "user"
                      ? "bg-[#eff6ff] text-gray-900 border-blue-200 rounded-tr-none"
                      : "bg-gray-100 text-gray-900 border-gray-200 rounded-tl-none"
                  }`}>
                    {chat.content === "" ? (
                      <span className="flex gap-1 items-center justify-center py-1">
                        <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" />
                        <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </span>
                    ) : (
                      chat.content
                    )}
                  </div>

                  {chat.role === "user" && (
                    <div className="p-1 h-6 w-6 rounded bg-gray-55 text-gray-600 flex items-center justify-center shrink-0 border border-gray-200">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}

                </div>
              ))
            )}
            
            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="p-1 h-6 w-6 rounded bg-[#eff6ff] text-[#003366] flex items-center justify-center shrink-0 border border-blue-200">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 rounded rounded-tl-none bg-gray-100 text-gray-400 border border-gray-200 font-semibold">
                  Querying cognitive system...
                </div>
              </div>
            )}

            {chatError && (
              <div className="p-2.5 rounded border border-red-200 bg-red-50 text-red-600 flex gap-2 items-center text-[10px] font-bold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{chatError}</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendChat} className="p-3 border-t border-gray-200 bg-gray-55 flex gap-2 shrink-0">
            <input
              type="text"
              placeholder="Ask this article..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              disabled={isTyping}
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#d60000] text-gray-900 font-semibold"
            />
            <button
              type="submit"
              disabled={!chatMessage.trim() || isTyping}
              className="p-1.5 bg-[#003366] hover:bg-[#002244] disabled:opacity-50 text-white rounded transition-colors flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
      
    </aside>
  );
}
