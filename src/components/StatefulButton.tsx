import React, { useState } from "react";
import { motion, useAnimate, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  className?: string;
  children: React.ReactNode;
  /**
   * Async action to run while the loader spins. Resolve → success checkmark.
   * Reject → loader hides and the label restores (errors surface elsewhere).
   */
  onAction?: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  /** Runs before any animation. Return false to abort (e.g. validation failed). */
  validate?: () => boolean;
}

/**
 * Stateful button — click plays a loading spinner, then a success checkmark.
 * Default `type="submit"`: it prevents the form's default submission itself,
 * so the surrounding form should only forward Enter-key submissions to it.
 */
export function StatefulButton({
  className,
  children,
  onAction,
  validate,
  disabled,
  type = "submit",
  ...props
}: ButtonProps) {
  const [scope, animate] = useAnimate();
  const [busy, setBusy] = useState(false);

  const animateLoading = async () => {
    await animate(
      ".loader",
      { width: "20px", scale: 1, display: "block" },
      { duration: 0.2 },
    );
  };

  const animateSuccess = async () => {
    await animate(
      ".loader",
      { width: "0px", scale: 0, display: "none" },
      { duration: 0.2 },
    );
    await animate(
      ".check",
      { width: "20px", scale: 1, display: "block" },
      { duration: 0.2 },
    );
    await animate(
      ".check",
      { width: "0px", scale: 0, display: "none" },
      { delay: 2, duration: 0.2 },
    );
  };

  const animateReset = async () => {
    await animate(
      ".loader",
      { width: "0px", scale: 0, display: "none" },
      { duration: 0.15 },
    );
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // The form is submitted through this handler only — never natively.
    event.preventDefault();
    if (busy || disabled) return;
    if (validate && !validate()) return;
    setBusy(true);
    await animateLoading();
    try {
      await onAction?.(event);
      await animateSuccess();
    } catch {
      await animateReset();
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.button
      layout
      ref={scope}
      type={type}
      disabled={disabled || busy}
      data-cursor="link"
      className={cn(
        "font-mono-ui pointer-events-auto inline-flex min-w-[120px] cursor-pointer items-center justify-center gap-2 rounded-full border border-amber-300/70 bg-amber-400 px-5 py-2.5 text-xs font-semibold tracking-[0.22em] uppercase text-[#221703] shadow-[0_0_28px_rgba(245,185,68,0.28)] ring-offset-2 transition duration-200 hover:ring-2 hover:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
      {...props}
      onClick={handleClick}
    >
      <motion.div layout className="flex items-center gap-2">
        <Loader />
        <CheckIcon />
        <motion.span layout>{children}</motion.span>
      </motion.div>
    </motion.button>
  );
}

const Loader = () => {
  return (
    <motion.svg
      animate={{ rotate: [0, 360] }}
      initial={{ scale: 0, width: 0, display: "none" }}
      style={{ scale: 0.5, display: "none" }}
      transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="loader text-[#221703]"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3a9 9 0 1 0 9 9" />
    </motion.svg>
  );
};

const CheckIcon = () => {
  return (
    <motion.svg
      initial={{ scale: 0, width: 0, display: "none" }}
      style={{ scale: 0.5, display: "none" }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="check text-[#221703]"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M9 12l2 2l4 -4" />
    </motion.svg>
  );
};
