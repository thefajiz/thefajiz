export function Star({ className = "", size = 14 }: { className?: string; size?: number }) {
  return (
    <span
      className={"text-gold inline-block " + className}
      style={{ fontSize: size, lineHeight: 1 }}
    >
      ✦
    </span>
  );
}

export function VLine({ height = 60 }: { height?: number }) {
  return (
    <span
      className="block bg-gold/60"
      style={{ width: 1, height }}
    />
  );
}
