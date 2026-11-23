import Link from "next/link";
import type { ComponentProps } from "react";

export type ButtonVariant = "cyan" | "magenta" | "yellow" | "ghost";
export type ButtonSize = "md" | "lg" | "xl";

type StyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pulse?: boolean;
  className?: string;
};

const BASE = [
  "relative inline-flex items-center justify-center gap-2.5",
  "font-pixel bg-transparent cursor-pointer border",
  "shadow-[0_0_0_transparent,inset_0_0_0_transparent]",
  "[transition:transform_80ms_ease,box-shadow_160ms_ease,color_160ms]",
  "[clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]",
  "before:content-[''] before:absolute before:inset-[3px] before:pointer-events-none",
  "before:border before:border-[rgba(0,245,255,0.25)] before:[clip-path:inherit]",
  "active:translate-y-px active:scale-[0.98]",
].join(" ");

const VARIANTS: Record<ButtonVariant, string> = {
  cyan: "border-cyan text-ink hover:text-cyan hover:shadow-[0_0_14px_rgba(0,245,255,0.55),inset_0_0_8px_rgba(0,245,255,0.35)]",
  magenta:
    "border-magenta text-ink hover:text-magenta hover:shadow-[0_0_14px_rgba(255,0,110,0.55),inset_0_0_8px_rgba(255,0,110,0.35)]",
  yellow:
    "border-yellow text-ink hover:text-yellow hover:shadow-[0_0_14px_rgba(245,255,0,0.6),inset_0_0_8px_rgba(245,255,0,0.35)]",
  ghost: "border-ink-faint text-ink-dim hover:text-ink hover:border-ink-dim hover:shadow-none",
};

const SIZES: Record<ButtonSize, string> = {
  md: "px-5 py-3 text-[10px] tracking-[0.16em]",
  lg: "px-7 py-4 text-[12px] tracking-[0.16em]",
  xl: "px-9 py-5 text-[14px] tracking-[0.2em]",
};

export function buttonClasses({ variant = "cyan", size = "md", pulse = false, className }: StyleProps = {}) {
  return [BASE, VARIANTS[variant], SIZES[size], pulse && "pulse", className].filter(Boolean).join(" ");
}

type ButtonProps = StyleProps & Omit<ComponentProps<"button">, "className">;

export function Button({ variant, size, pulse, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, pulse, className })} {...props} />;
}

type ButtonLinkProps = StyleProps & Omit<ComponentProps<typeof Link>, "className">;

export function ButtonLink({ variant, size, pulse, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses({ variant, size, pulse, className })} {...props} />;
}
