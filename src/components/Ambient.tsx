import { useEffect, useState } from "react";

export function Ambient() {
  const [pos, setPos] = useState({ x: 50, y: 30 });

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      setPos({
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <>
      <div className="ambient-grid" aria-hidden="true" />
      <div className="ambient-grain" aria-hidden="true" />
      <div
        className="ambient-spotlight"
        aria-hidden="true"
        style={{ "--mx": `${pos.x}%`, "--my": `${pos.y}%` } as React.CSSProperties}
      />
    </>
  );
}
