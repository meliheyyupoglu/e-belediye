"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { getWelcomeMessage, QUICK_QUESTIONS } from "@/lib/faq";
import { belediyeWhatsappNumber } from "@/lib/mudurlukler";

interface Message {
  role: "user" | "bot";
  text: string;
}

interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(Boolean(SpeechRecognition));
  }, []);

  useEffect(() => {
    if (open && !initialized) {
      setMessages([{ role: "bot", text: getWelcomeMessage() }]);
      setInitialized(true);
    }
  }, [open, initialized]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg = text.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "bot", text: data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: "bot", text: "Bağlantı hatası. Lütfen tekrar deneyin." }]);
    }
    setLoading(false);
  }

  function send() {
    sendMessage(input);
  }

  function toggleVoiceInput() {
    if (listening) {
      stopListening();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "tr-TR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        setInput(transcript);
        sendMessage(transcript);
      }
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  const whatsappUrl = `https://wa.me/${belediyeWhatsappNumber()}?text=${encodeURIComponent("Merhaba, Dörtyol Belediyesi e-Belediye hakkında bilgi almak istiyorum.")}`;
  const showQuickQuestions = messages.length <= 1;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-safe right-4 sm:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark transition hover:scale-105 active:scale-95"
        aria-label="Canlı destek"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 sm:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="fixed z-50 flex flex-col overflow-hidden bg-white shadow-2xl border border-gray-200
            inset-x-0 bottom-0 rounded-t-2xl max-h-[88dvh] animate-slide-up
            sm:inset-auto sm:bottom-safe-panel sm:right-6 sm:w-96 sm:rounded-2xl sm:max-h-none sm:animate-fade-in">
            <div className="sm:hidden flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>
            <div className="bg-primary px-4 py-3 text-white flex items-start justify-between gap-2 shrink-0">
              <div>
                <p className="font-semibold text-sm">e-Belediye Asistan</p>
                <p className="text-xs text-blue-100">Dörtyol Belediyesi dijital yardımcınız</p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1 rounded-lg bg-green-500 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-green-600 transition"
                title="WhatsApp ile iletişim"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.89-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>

            {showQuickQuestions && (
              <div className="px-3 pt-3 flex flex-wrap gap-1.5 shrink-0">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    className="text-xs px-2.5 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-600 active:bg-blue-50 active:border-primary/30 active:text-primary transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 sm:max-h-72">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${
                    m.role === "user" ? "bg-primary text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-3 py-2 text-sm text-gray-400">Yazıyor...</div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t p-3 flex gap-2 shrink-0 pb-safe">
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  disabled={loading}
                  className={`shrink-0 rounded-lg px-2.5 py-2 transition min-h-[44px] ${
                    listening
                      ? "bg-red-100 text-red-600 animate-pulse"
                      : "border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-primary"
                  }`}
                  aria-label={listening ? "Dinlemeyi durdur" : "Sesli mesaj"}
                  title={listening ? "Dinleniyor..." : "Sesli mesaj"}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              )}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={listening ? "Dinleniyor..." : "Mesajınızı yazın..."}
                className="flex-1 text-base sm:text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-primary min-h-[44px]"
              />
              <button onClick={send} disabled={loading} className="btn-primary px-3 py-2 text-sm shrink-0">
                Gönder
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
