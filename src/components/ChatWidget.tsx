import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, SendHorizontal, X } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

type Msg = { role: "user" | "bot"; text: string };

const SUGGESTIONS = [
  "Who is Vijay?",
  "What skills is he learning?",
  "How can I contact him?",
] as const;

/**
 * Vijay Bot — a floating portfolio assistant.
 * The launcher is a pulsing amber orb; the panel opens with a spring pop.
 * All answers come from the Convex `chat.ask` action (OpenAI, portfolio-scoped).
 */
export function ChatWidget() {
  const ask = useAction(api.chat.ask);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "Hey! I'm Vijay Bot ⚡ Ask me anything about Vijay — his skills, studies, or how to reach him.",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Autoscroll to the newest message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  // Focus input when opening
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || thinking) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setThinking(true);
    try {
      const res = await ask({ question: q });
      setMessages((m) => [...m, { role: "bot", text: res.answer }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text:
            err instanceof Error
              ? err.message
              : "Hmm, my circuits hiccuped — try again in a moment.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  }

  return (
    <>
      {/* ─── Panel ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Chat with Vijay Bot"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="pf-glass pf-noise pointer-events-auto fixed right-4 bottom-24 z-[80] flex h-[min(560px,70dvh)] w-[min(380px,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl border-amber-300/25 shadow-[0_24px_70px_-18px_rgba(245,185,68,0.35)] sm:right-6 sm:bottom-28"
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3.5">
              <div className="relative">
                <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 font-display text-sm font-bold text-[#221703]">
                  KV
                </div>
                <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-[#141109] bg-[#b8cf8a]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display truncate text-sm font-semibold text-white">Vijay Bot</p>
                <p className="font-mono-ui text-[10px] tracking-[0.18em] text-[#b8cf8a] uppercase">
                  {thinking ? "Typing…" : "Online · answers about Vijay"}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                data-cursor="link"
                className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3.5 overflow-y-auto px-4 py-4"
              aria-live="polite"
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-md bg-amber-400 font-medium text-[#221703]"
                        : "rounded-bl-md border border-white/10 bg-white/[0.06] text-white/90"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {thinking && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-4 py-3">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="size-1.5 rounded-full bg-amber-300"
                        animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && !thinking && (
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={s}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    onClick={() => void send(s)}
                    data-cursor="link"
                    className="cursor-pointer rounded-full border border-amber-300/30 bg-amber-400/[0.07] px-3 py-1.5 text-[11px] font-medium text-amber-100 transition hover:border-amber-300/60 hover:bg-amber-400/15"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="flex items-center gap-2 border-t border-white/10 bg-white/[0.03] p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Vijay…"
                aria-label="Message Vijay Bot"
                maxLength={500}
                className="h-10 min-w-0 flex-1 rounded-xl border border-white/15 bg-white/[0.05] px-3.5 text-[13px] text-white placeholder:text-white/40 focus:border-amber-300/70 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(245,185,68,0.15)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                aria-label="Send message"
                data-cursor="link"
                className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl bg-gradient-to-br from-amber-300 to-orange-500 text-[#221703] shadow-[0_0_18px_rgba(245,185,68,0.3)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                <SendHorizontal className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Floating launcher ──────────────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat — ask about Vijay"}
        aria-expanded={open}
        data-cursor="link"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 1.2 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="pointer-events-auto fixed right-4 bottom-4 z-[80] grid size-14 cursor-pointer place-items-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 text-[#221703] shadow-[0_10px_36px_-6px_rgba(245,185,68,0.55)] sm:right-6 sm:bottom-6"
      >
        {/* Radar ping */}
        <span
          className="absolute inset-0 rounded-full bg-amber-400/40"
          style={{ animation: "pf-ping 2.4s cubic-bezier(0,0,0.2,1) infinite" }}
          aria-hidden="true"
        />
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X className="size-6" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle className="size-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
