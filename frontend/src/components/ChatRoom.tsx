'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MapPin, CheckCircle, Info, ChevronRight, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage, HotelCardInfo, TransportCardInfo } from '../types';

interface ChatRoomProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  suggestions: string[];
  isLoading: boolean;
  onSelectHotel: (hotelName: string) => void;
  onSelectVehicle: (vehicleName: string, route: string) => void;
}

export default function ChatRoom({
  messages,
  onSendMessage,
  suggestions,
  isLoading,
  onSelectHotel,
  onSelectVehicle,
}: ChatRoomProps) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading) return;
    onSendMessage(suggestion);
  };

  return (
    <div className="flex-1 bg-slate-50/50 flex flex-col h-full min-w-0">
      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto my-auto select-none">
            <div className="bg-indigo-50 text-indigo-600 p-4 rounded-3xl shadow-sm border border-indigo-100/50 mb-4 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">TravelDoc Grounded Assistant</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">
              Tôi là Trợ lý AI được huấn luyện dựa trên tài liệu du lịch của bạn. Tôi chỉ trả lời các câu hỏi dựa trên thông tin đã được kiểm chứng trong hệ thống.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {/* Avatar */}
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-md shadow-indigo-100 self-start">
                    AI
                  </div>
                )}

                {/* Message Bubble container */}
                <div className={`flex flex-col gap-2 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3.5 shadow-sm border ${
                      isUser
                        ? 'bg-indigo-600 border-indigo-600 text-white font-medium'
                        : 'bg-white border-slate-100 text-slate-800'
                    }`}
                  >
                    {isUser ? (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="text-sm prose prose-slate max-w-none prose-sm leading-relaxed
                        prose-headings:font-bold prose-headings:text-slate-800
                        prose-p:my-1.5 prose-p:leading-relaxed
                        prose-table:border-collapse prose-table:my-3 prose-table:w-full
                        prose-th:bg-slate-50 prose-th:p-2.5 prose-th:text-xs prose-th:font-extrabold prose-th:text-slate-500 prose-th:border prose-th:border-slate-100 prose-th:text-left
                        prose-td:p-2.5 prose-td:text-xs prose-td:font-bold prose-td:text-indigo-600 prose-td:border prose-td:border-slate-100"
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {/* Recommendations (Hotel / Transport Cards) */}
                  {!isUser && (
                    <>
                      {msg.hotelCard && (
                        <div className="w-full mt-2 bg-gradient-to-br from-amber-50/70 to-orange-50/40 border border-amber-200/60 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm shadow-amber-100/50">
                          <div>
                            <span className="text-[9px] font-extrabold tracking-widest text-amber-700 bg-amber-100 border border-amber-200/50 px-2 py-0.5 rounded-full uppercase">
                              RECOMMENDED HOTEL
                            </span>
                            <h4 className="text-sm font-extrabold text-amber-900 mt-2 tracking-tight">
                              {msg.hotelCard.name}
                            </h4>
                            <p className="text-xs font-semibold text-amber-700/80 mt-0.5">
                              From {msg.hotelCard.priceRange} / night
                            </p>
                            <div className="flex items-center gap-1 mt-2 text-amber-500">
                              {Array.from({ length: msg.hotelCard.starRating }).map((_, i) => (
                                <span key={i} className="text-sm">★</span>
                              ))}
                              <span className="text-[10px] text-amber-600 font-bold ml-1">{msg.hotelCard.starRating} Stars</span>
                            </div>
                          </div>
                          <button
                            onClick={() => onSelectHotel(msg.hotelCard!.name)}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all self-end md:self-center shadow-md shadow-orange-200 cursor-pointer"
                          >
                            SELECT HOTEL
                          </button>
                        </div>
                      )}

                      {msg.transportCard && (
                        <div className="w-full mt-2 bg-gradient-to-br from-blue-50/60 to-indigo-50/30 border border-blue-200/60 rounded-xl p-4 shadow-sm shadow-blue-100/50">
                          <span className="text-[9px] font-extrabold tracking-widest text-blue-700 bg-blue-100 border border-blue-200/50 px-2 py-0.5 rounded-full uppercase">
                            VEHICLE RECOMMENDATION
                          </span>
                          <h4 className="text-xs font-extrabold text-slate-800 mt-2">
                            Lộ trình: {msg.transportCard.route}
                          </h4>
                          <div className="flex flex-col gap-2 mt-3">
                            {msg.transportCard.providers.map((p, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-white/70 p-2 rounded-lg border border-slate-100">
                                <div>
                                  <p className="text-xs font-bold text-slate-700">{p.name}</p>
                                  <p className="text-[10px] text-slate-400 font-semibold">{p.policy}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-extrabold text-blue-600">{p.price}</span>
                                  <button
                                    onClick={() => onSelectVehicle(p.name, msg.transportCard!.route)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                                  >
                                    SELECT
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Citations Badges */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5 select-none">
                          {msg.citations.map((cite, i) => (
                            <div
                              key={i}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200 text-[10px] font-bold"
                              title={cite.snippet}
                            >
                              <FileText className="w-3 h-3 text-slate-400" />
                              <span>{cite.filename}</span>
                              <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1 py-0.2 rounded ml-1">
                                Verified
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Timestamp */}
                  <span className="text-[10px] font-semibold text-slate-400 px-1 mt-0.5">
                    {msg.timestamp}
                  </span>
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 font-extrabold text-sm self-start">
                    U
                  </div>
                )}
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-md animate-pulse">
              AI
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Chips & Chat Box */}
      <div className="p-4 border-t border-slate-100 bg-white">
        {/* Suggested Prompt Chips */}
        {suggestions.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-1 select-none scrollbar-none">
            <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase shrink-0">SUGGESTIONS:</span>
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(s)}
                className="shrink-0 text-xs font-semibold px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-600 hover:text-indigo-700 rounded-full transition-all duration-150 cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input box */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about hotel rates, bus schedules, or compare services..."
              className="w-full border border-slate-200 focus:border-indigo-500 rounded-xl pl-4 pr-10 py-3 text-sm font-semibold placeholder-slate-400 focus:outline-none bg-slate-50/50"
              disabled={isLoading}
            />
            <div className="absolute right-3.5 top-3.5 text-slate-300">
              <Info className="w-4 h-4 cursor-pointer hover:text-slate-400" />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-extrabold text-sm flex items-center gap-1.5 transition-all shadow-md shadow-indigo-100/50 hover:shadow-lg hover:shadow-indigo-200/50 cursor-pointer"
          >
            <span>SUBMIT</span>
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
