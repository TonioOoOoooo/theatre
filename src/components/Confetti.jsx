import { useMemo } from "react";

export function MiniConfetti() {
  const pieces = useMemo(() => {
    const colors = ["#fbbf24", "#f472b6", "#34d399", "#60a5fa", "#a78bfa", "#fb923c"];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: 30 + Math.random() * 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      size: 5 + Math.random() * 6,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece rounded-sm"
          style={{
            left: p.left + "%",
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDelay: p.delay + "s",
          }}
        />
      ))}
    </div>
  );
}

export default function Confetti() {
  const pieces = useMemo(() => {
    const colors = ["#fbbf24", "#f472b6", "#34d399", "#60a5fa", "#a78bfa", "#fb923c", "#f43f5e", "#22d3ee"];
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      size: 6 + Math.random() * 10,
      shape: Math.random() > 0.5 ? "rounded-full" : "rounded-sm",
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((p) => (
        <div
          key={p.id}
          className={`confetti-piece ${p.shape}`}
          style={{
            left: p.left + "%",
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDelay: p.delay + "s",
          }}
        />
      ))}
    </div>
  );
}
