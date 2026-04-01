export default function Stars({ count, max = 3, size = "text-xl" }) {
  return (
    <span className={size}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < count ? "text-yellow-400" : "text-gray-600"}>
          ⭐
        </span>
      ))}
    </span>
  );
}
