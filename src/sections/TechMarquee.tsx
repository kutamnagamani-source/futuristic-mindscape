import { profile } from "@/data/portfolio";

/** Infinite scrolling divider strip between sections. */
export function TechMarquee() {
  const items = [
    profile.role,
    "NEURAL NETWORKS",
    profile.location.toUpperCase(),
    "DEEP LEARNING",
    "CREATIVE TECHNOLOGY",
    "LLM AGENTS",
    profile.availability.toUpperCase(),
  ];

  const strip = (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="font-mono-ui px-6 text-[11px] tracking-[0.3em] text-[#e8d5ae]/80">
            {item}
          </span>
          <span className="size-1.5 rotate-45 bg-amber-400/60" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden border-y border-white/10 py-4" aria-hidden="true">
      <div className="pf-marquee flex w-max">
        {strip}
        {strip}
      </div>
    </div>
  );
}
