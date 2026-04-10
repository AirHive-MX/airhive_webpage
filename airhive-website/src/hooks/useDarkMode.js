import { useState, useEffect } from "react";

export default function useDarkMode() {
  const [isDark, setIsDark] = useState(
    typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-theme") === "dark"
  );

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  return isDark;
}
