type CategoryBadgeProps = {
  name?: string | null;
  color?: string | null;
  size?: "sm" | "md";
};

const isValidHex = (value?: string | null) =>
  Boolean(value && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value));

export default function CategoryBadge({
  name,
  color,
  size = "sm",
}: CategoryBadgeProps) {
  const safeColor = isValidHex(color) ? color! : "#e5e7eb"; // default gray-200
  const textSize =
    size === "md"
      ? "text-xs sm:text-sm"
      : "text-[11px] sm:text-xs";

  return (
    <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full border bg-white ${textSize}`}>
      <span
        aria-hidden
        className="w-2.5 h-2.5 rounded-full border border-black/5"
        style={{ backgroundColor: safeColor }}
      />
      <span className="text-gray-700 truncate max-w-[160px] sm:max-w-[200px]">
        {name || "카테고리 없음"}
      </span>
    </span>
  );
}
