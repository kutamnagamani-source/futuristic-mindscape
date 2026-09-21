import { action, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

/**
 * Contact form backend.
 * - Every message is stored in Convex (you can query it from the dashboard).
 * - If RESEND_API_KEY is set (Keys tab), each submission also emails you.
 * - Rate limit: 3 messages per name+email per minute.
 *
 * The action is public (anyone can submit the contact form) but validated
 * and rate-limited server-side. Secrets stay server-side via process.env.
 */

const WINDOW_MS = 60_000; // 1 minute
const MAX_PER_WINDOW = 3;

export const submit = action({
  args: { name: v.string(), email: v.string(), message: v.string() },
  handler: async (ctx, { name, email, message }) => {
    const n = name.trim();
    const e = email.trim();
    const m = message.trim();

    // ── Server-side validation (mirrors the client) ──────────────────────
    if (n.length < 2) throw new Error("Please enter your name (min 2 characters).");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw new Error("Please enter a valid email address.");
    if (m.length < 10) throw new Error("Message should be at least 10 characters.");
    if (n.length > 100 || e.length > 200 || m.length > 5000) {
      throw new Error("Your message is too long.");
    }

    // ── Rate limit: 3 per name+email per minute ──────────────────────────
    const key = `${e.toLowerCase()}::${n.toLowerCase()}`;
    const recent = await ctx.runQuery(internal.contact.countRecent, {
      key,
      since: Date.now() - WINDOW_MS,
    });
    if (recent >= MAX_PER_WINDOW) {
      throw new Error("Too many messages from this address — please wait a minute.");
    }

    // ── Store the message (always succeeds) ──────────────────────────────
    const createdAt = Date.now();
    await ctx.runMutation(internal.contact.store, { name: n, email: e, message: m, createdAt });

    // ── Email delivery via Resend (only when the API key exists) ─────────
    let emailSent = false;
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { error } = await resend.emails.send({
          // onboarding@resend.dev works from any account while testing;
          // swap to a verified domain later for production deliverability.
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: [profileEmail()],
          subject: `Portfolio message from ${n}`,
          text: `Name: ${n}\nEmail: ${e}\n\n${m}\n\n— Sent from your portfolio contact form`,
          replyTo: e,
        });
        emailSent = !error;
        if (error) console.warn("Resend error:", error.message);
      } catch (err) {
        console.warn("Email delivery failed (message still stored):", err);
      }
    }

    return { ok: true as const, emailSent };
  },
});

/** Where notification emails are delivered. */
function profileEmail() {
  return "kutamnagamani@gmail.com";
}

// ─── Internal query + mutation (called by the action) ──────────────────────

export const countRecent = internalQuery({
  args: { key: v.string(), since: v.number() },
  handler: async (ctx, { key, since }) => {
    const rows = await ctx.db
      .query("messages")
      .withIndex("by_key_and_time", (q) => q.eq("key", key).gt("createdAt", since))
      .collect();
    return rows.length;
  },
});

export const store = internalMutation({
  args: { name: v.string(), email: v.string(), message: v.string(), createdAt: v.number() },
  handler: async (ctx, { name, email, message, createdAt }) => {
    const key = `${email.toLowerCase()}::${name.toLowerCase()}`;
    await ctx.db.insert("messages", { name, email, message, key, createdAt });
  },
});
