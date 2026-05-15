import { Star } from "./Ornament";

export function VOrnament({ height = 80 }: { height?: number }) {
  return (
    <div className="flex flex-col items-center gap-2 my-12">
      <Star size={10} />
      <span className="block bg-gold/70" style={{ width: 1, height }} />
      <Star size={10} />
    </div>
  );
}
