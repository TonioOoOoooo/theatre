import { useMemo } from "react";

export default function Confetti() {
  const pieces = useMemo(() => {
    const colors = ["#fbbf24", "#f472b6", "#34d399", "#60a5fa", "#a78bfa", "#fb923c"];
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 1.5,
      size: 6 + Math.random() * 8,
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
