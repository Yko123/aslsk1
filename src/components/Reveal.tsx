import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/** Fades its children in the first time they scroll into view. */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "li" | "section" | "article";
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setShown(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style = { "--delay": `${delay}ms` } as CSSProperties;
  return (
    <Tag ref={ref as never} className={`reveal ${shown ? "reveal-in" : ""} ${className}`} style={style}>
      {children}
    </Tag>
  );
}
