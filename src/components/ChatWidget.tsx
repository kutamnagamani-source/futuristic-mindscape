import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SendHorizontal, Volume2, VolumeX, X } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type Msg = { role: "user" | "bot"; text: string };

const SUGGESTIONS = [
  "Who is Vijay?",
  "What skills is he learning?",
  "How can I contact him?",
] as const;

/**
 * Vijay Bot — a floating 3D-style mascot orb with a face, orbiting ring +
 * satellite, and a VOICE ON/OFF pill (browser speech synthesis, no key).
 * The panel opens with a spring pop; answers come from the Convex
 * `chat.ask` action (Gemini/OpenAI, strictly portfolio-scoped).
 */
export function ChatWidget() {
  const ask = useAction(api.chat.ask);
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [speaking, setSpeaking] = useState(false);
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

  // Stop speaking when the widget unmounts or the tab closes mid-speech
  useEffect(() => {
    const stop = () => window.speechSynthesis?.cancel();
    window.addEventListener("beforeunload", stop);
    return () => {
      window.removeEventListener("beforeunload", stop);
      stop();
    };
  }, []);

  /** Speak a bot line aloud when voice is on. */
  function speak(text: string) {
    if (!voiceOn || typeof window.speechSynthesis === "undefined") return;
    window.speechSynthesis.cancel();
    // Strip emoji/decoration for cleaner speech
    const clean = text.replace(/\p{Extended_Pictographic}/gu, "").replace(/\u200d|\uFE0F/g, "");
    const utter = new SpeechSynthesisUtterance(clean);
    utter.rate = 1.02;
    utter.pitch = 1.05;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  }

  function toggleVoice() {
    setVoiceOn((v) => {
      const next = !v;
      if (!next) window.speechSynthesis?.cancel();
      setSpeaking(false);
      return next;
    });
  }

  async function send(text: string) {
    const q = text.trim();
    if (!q || thinking) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setThinking(true);
    try {
      const res = await ask({ question: q });
      setMessages((m) => [...m, { role: "bot", text: res.answer }]);
      speak(res.answer);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Hmm, my circuits hiccuped — try again in a moment.";
      setMessages((m) => [...m, { role: "bot", text: msg }]);
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
            className="pf-glass pf-noise pointer-events-auto fixed right-4 bottom-40 z-[80] flex h-[min(540px,64dvh)] w-[min(380px,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl border-amber-300/25 shadow-[0_24px_70px_-18px_rgba(245,185,68,0.35)] sm:right-8 sm:bottom-44"
          >
            {/* Header — mascot chip */}
            <div className="relative flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3.5">
              <div className="relative">
                <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#ffe9bd] via-[#f5b944] to-[#c67b2e] shadow-[inset_0_-3px_6px_rgba(146,64,14,0.45),inset_0_3px_5px_rgba(255,244,214,0.9),0_2px_10px_rgba(245,185,68,0.45)]">
                  <MiniFace talking={speaking || thinking} />
                </div>
                <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-[#141109] bg-[#b8cf8a]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display truncate text-sm font-semibold text-white">Vijay Bot</p>
                <p className="font-mono-ui text-[10px] tracking-[0.18em] text-[#b8cf8a] uppercase">
                  {speaking ? "Speaking…" : thinking ? "Typing…" : "Online · answers about Vijay"}
                </p>
              </div>
              <button
                onClick={toggleVoice}
                aria-pressed={voiceOn}
                aria-label={voiceOn ? "Turn voice off" : "Turn voice on"}
                data-cursor="link"
                title={voiceOn ? "Voice on — click to mute" : "Voice off — click to hear answers"}
                className={`grid size-8 shrink-0 cursor-pointer place-items-center rounded-full transition ${
                  voiceOn
                    ? "bg-amber-400/20 text-amber-200 ring-1 ring-amber-300/50"
                    : "text-white/50 hover:bg-white/10 hover:text-white"
                }`}
              >
                {voiceOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
              </button>
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
                className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl bg-gradient-to-br from-[#ffe9bd] via-[#f5b944] to-[#c67b2e] text-[#221703] shadow-[0_0_18px_rgba(245,185,68,0.3)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                <SendHorizontal className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Floating mascot launcher ───────────────────────────────────── */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-[80] flex flex-col items-end gap-3 sm:right-8 sm:bottom-6">
        {/* Voice pill */}
        <AnimatePresence>
          {!open && (
            <motion.button
              key="voice-pill"
              onClick={toggleVoice}
              aria-pressed={voiceOn}
              aria-label={voiceOn ? "Voice on — click to mute" : "Voice off — click to hear answers"}
              data-cursor="link"
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className={`font-mono-ui pointer-events-auto inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold tracking-[0.22em] uppercase shadow-lg transition-colors ${
                voiceOn
                  ? "bg-amber-400 text-[#221703] shadow-[0_8px_24px_-6px_rgba(245,185,68,0.6)]"
                  : "bg-[#1c160c]/90 text-amber-200 ring-1 ring-amber-300/40 backdrop-blur"
              }`}
            >
              {voiceOn ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
              {voiceOn ? "Voice on" : "Voice off"}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Orb + orbit system */}
        <motion.button
          onClick={() => {
            window.speechSynthesis?.cancel();
            setOpen((v) => !v);
          }}
          aria-label={open ? "Close chat" : "Open chat — ask about Vijay"}
          aria-expanded={open}
          data-cursor="link"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 1 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.93 }}
          className="pointer-events-auto relative grid size-24 cursor-pointer place-items-center"
        >
          {/* Outer thin orbit ring */}
          <span
            aria-hidden="true"
            className={`absolute inset-0 rounded-full border border-amber-200/35 transition-transform duration-700 ${
              open ? "scale-90 opacity-0" : reduced ? "" : "pf-orbit-spin"
            }`}
          />
          {/* Orbit satellite */}
          {!open && !reduced && (
            <span aria-hidden="true" className="absolute inset-0 pf-orbit-spin">
              <span className="absolute top-1/2 -right-[3px] size-2.5 -translate-y-1/2 rounded-full bg-[#b8cf8a] shadow-[0_0_10px_rgba(184,207,138,0.9)]" />
            </span>
          )}

          {/* The glossy 3D orb */}
          <span
            aria-hidden="true"
            className="relative grid size-[4.6rem] place-items-center rounded-full bg-[radial-gradient(circle_at_32%_26%,#ffe9bd_0%,#f8c95c_34%,#e19a3c_62%,#a8641f_100%)] shadow-[inset_0_-10px_18px_rgba(122,53,10,0.55),inset_0_8px_14px_rgba(255,244,214,0.85),0_16px_38px_-8px_rgba(245,185,68,0.55)]"
          >
            {/* Specular highlight */}
            <span className="pointer-events-none absolute top-[14%] left-[22%] h-4 w-7 -rotate-[24deg] rounded-full bg-white/70 blur-[3px]" />
            {/* Radar ping behind */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-amber-400/30"
              style={{ animation: reduced ? undefined : "pf-ping 2.6s cubic-bezier(0,0,0.2,1) infinite" }}
            />
            {/* Face */}
            <BotFace talking={speaking || thinking} reduced={reduced} />
            {/* Name */}
            <span className="font-mono-ui absolute -bottom-0.5 text-[8px] font-bold tracking-[0.3em] text-[#3a2405] uppercase">
              VIJAY
            </span>
          </span>
        </motion.button>
      </div>
    </>
  );
}

/** Full face for the big orb — eyes + talking mouth. */
function BotFace({ talking, reduced }: { talking: boolean; reduced: boolean }) {
  return (
    <span aria-hidden="true" className="relative z-10 flex flex-col items-center gap-1.5">
      <span className="flex items-center gap-3">
        <Eye reduced={reduced} />
        <Eye reduced={reduced} />
      </span>
      {/* Mouth — animates while speaking/thinking */}
      <motion.span
        className="block h-[5px] rounded-full bg-[#3a2405]"
        animate={
          reduced
            ? { width: 14 }
            : talking
              ? { width: [14, 10, 16, 8, 14], height: [5, 9, 5, 10, 5] }
              : { width: 14, height: 5 }
        }
        transition={talking ? { duration: 0.7, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
      />
    </span>
  );
}

/** Blinking eye. */
function Eye({ reduced }: { reduced: boolean }) {
  return (
    <motion.span
      className="block h-[11px] w-[9px] rounded-full bg-[#3a2405]"
      animate={reduced ? { scaleY: 1 } : { scaleY: [1, 1, 0.08, 1] }}
      transition={{ duration: 3.4, repeat: Infinity, times: [0, 0.9, 0.95, 1], ease: "easeInOut" }}
    />
  );
}

/** Tiny face for the header chip. */
function MiniFace({ talking }: { talking: boolean }) {
  return (
    <span aria-hidden="true" className="flex flex-col items-center gap-[3px]">
      <span className="flex items-center gap-[5px]">
        <span className="block size-[4px] rounded-full bg-[#3a2405]" />
        <span className="block size-[4px] rounded-full bg-[#3a2405]" />
      </span>
      <motion.span
        className="block h-[2.5px] rounded-full bg-[#3a2405]"
        animate={talking ? { width: [7, 4, 8, 7] } : { width: 7 }}
        transition={talking ? { duration: 0.6, repeat: Infinity } : { duration: 0.2 }}
      />
    </span>
  );
}
