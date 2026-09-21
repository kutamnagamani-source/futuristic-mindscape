import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import { MagneticButton } from "@/components/MagneticButton";
import { SocialIcon } from "@/data/social-icons";
import { socials, profile } from "@/data/portfolio";

type Status = "idle" | "loading" | "success" | "error";

/**
 * Contact: immersive form over the portal zone of the 3D world.
 * v1 validates and simulates send locally; wire `handleSubmit` to a Convex
 * action or serverless endpoint later without touching the UI.
 */
export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: typeof errors = {};
    if (name.length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please enter a valid email.";
    if (message.length < 10) next.message = "Message should be at least 10 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    // PLACEHOLDER: replace with a real API call (Convex action / serverless).
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
    form.reset();
  }

  return (
    <section id="contact" className="pointer-events-auto relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-mono-ui text-xs tracking-[0.3em] text-amber-200 uppercase"
          >
            03 — Say hello
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display mt-4 text-4xl leading-[1.05] font-bold text-white sm:text-5xl"
          >
            Let's build<br />
            <span className="pf-gradient-text">something amazing.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="pf-muted mt-5 max-w-md text-[15px] leading-relaxed sm:text-lg"
          >
            Have an idea, a project, or an internship opportunity? My inbox is always open — I'll get
            back to you within a day.
          </motion.p>

          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-9 flex flex-wrap gap-2.5"
          >
            {socials.map((s) => (
              <li key={s.id}>
                <a
                  href={s.url}
                  target={s.id === "email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  data-cursor="link"
                  className="pf-glass flex items-center gap-2.5 rounded-full py-2 pr-4 pl-3 text-[13px] font-medium text-white/90 transition-all duration-300 hover:border-amber-300/50 hover:text-amber-100 hover:bg-amber-400/10"
                >
                  <SocialIcon id={s.id} className="size-4" />
                  {s.label}
                  <ArrowUpRight className="size-3 opacity-50" />
                </a>
              </li>
            ))}
          </motion.ul>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-mono-ui mt-8 text-xs tracking-[0.2em] text-white/65"
          >
            {profile.email} · {profile.location}
          </motion.p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={handleSubmit}
          noValidate
          className="pf-noise pf-glass relative overflow-hidden rounded-3xl p-6 sm:p-8"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" name="name" error={errors.name} placeholder="Ada Lovelace" />
            <Field
              label="Email"
              name="email"
              type="email"
              error={errors.email}
              placeholder="you@example.com"
            />
          </div>
          <div className="mt-5">
            <Field label="Message" name="message" textarea error={errors.message} placeholder="Tell me about your idea…" />
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <MagneticButton type="submit" disabled={status === "loading"} ariaLabel="Send message">
              {status === "loading" ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Sending
                </>
              ) : (
                "Send message"
              )}
            </MagneticButton>

            {/* Live region for a11y */}
            <p aria-live="polite" className="min-h-5 text-xs">
              {status === "success" && (
                <span className="inline-flex items-center gap-1.5 text-[#b8cf8a]">
                  <CheckCircle2 className="size-3.5" /> Message sent — thank you!
                </span>
              )}
              {status === "error" && Object.keys(errors).length > 0 && (
                <span className="inline-flex items-center gap-1.5 text-rose-300">
                  <TriangleAlert className="size-3.5" /> Please fix the highlighted fields.
                </span>
              )}
            </p>
          </div>

          <div className="pointer-events-none absolute -right-14 -bottom-14 size-40 rounded-full bg-amber-500/12 blur-3xl" />
        </motion.form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea,
  error,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  error?: string;
  placeholder?: string;
}) {
  const base =
    "peer w-full rounded-xl border bg-white/[0.05] px-4 py-3 text-[15px] text-white placeholder:text-white/40 transition-all duration-300 focus:bg-white/[0.07] focus:outline-none";
  const border = error
    ? "border-rose-400/60 focus:border-rose-300"
    : "border-white/15 focus:border-amber-300/70 focus:shadow-[0_0_0_3px_rgba(245,185,68,0.15)]";

  return (
    <label className="block">
      <span className="font-mono-ui mb-2 block text-[10px] tracking-[0.25em] text-white/65 uppercase">
        {label}
      </span>
      {textarea ? (
        <textarea name={name} rows={5} placeholder={placeholder} aria-invalid={!!error} className={`${base} ${border} resize-none`} />
      ) : (
        <input name={name} type={type} placeholder={placeholder} aria-invalid={!!error} className={`${base} ${border}`} />
      )}
      {error && <span className="mt-1.5 block text-[11px] text-rose-300">{error}</span>}
    </label>
  );
}
