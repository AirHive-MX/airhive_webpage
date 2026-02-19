import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollEffects = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("section, article"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    elements.forEach((el, idx) => {
      el.classList.add("ah-auto-reveal");
      el.style.setProperty("--ah-reveal-delay", `${(idx % 6) * 60}ms`);
      if (reduceMotion) {
        el.classList.add("is-visible");
      }
    });

    if (reduceMotion || !elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -7% 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname, hash]);

  return null;
};

export default ScrollEffects;
