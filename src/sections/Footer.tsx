import { SocialIcon } from "@/data/social-icons";
import { profile, socials } from "@/data/portfolio";

/** Minimal futuristic footer with a slow-pulsing monogram. */
export function Footer() {
  return (
    <footer className="pointer-events-auto relative border-t border-white/5 px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10">
        <div className="pf-pulse-soft relative grid size-12 place-items-center">
          <span className="absolute inset-0 rounded-2xl border border-cyan-300/30 bg-cyan-400/5" />
          <span className="font-display text-sm font-bold text-cyan-200">{profile.initials}</span>
        </div>

        <p className="font-mono-ui text-center text-[11px] tracking-[0.35em] text-white/60 uppercase">
          Designed &amp; built with code + creativity
        </p>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3">
            {[
              ["#home", "Home"],
              ["#about", "About"],
              ["#skills", "Skills"],
              ["#contact", "Contact"],
            ].map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  data-cursor="link"
                  className="text-xs tracking-[0.18em] text-white/75 uppercase transition-colors hover:text-cyan-200"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex gap-3">
          {socials.map((s) => (
            <li key={s.id}>
              <a
                href={s.url}
                target={s.id === "email" ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={s.label}
                data-cursor="link"
                className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition-all duration-300 hover:border-cyan-300/40 hover:text-cyan-200"
              >
                <SocialIcon id={s.id} className="size-4" />
              </a>
            </li>
          ))}
        </ul>

        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} {profile.name} — All rights reserved.
        </p>
      </div>
    </footer>
  );
}
