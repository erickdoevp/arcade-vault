"use client";

import { useEffect } from "react";

/**
 * Scroll reveal for the landing. Renders nothing: once mounted it observes every
 * `.reveal` element and adds `.in` the first time it enters the viewport.
 * Mount it after the sections so they already exist when the effect runs.
 */
export function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
