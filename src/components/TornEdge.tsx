export function TornEdge({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className="w-full"
      style={{ height: 60, transform: flip ? "scaleY(-1)" : undefined }}
    >
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full block">
        <path
          d="M0,30 L40,18 L80,34 L130,12 L180,28 L230,16 L290,32 L340,14 L400,30
             L460,18 L520,34 L580,12 L640,28 L700,16 L760,32 L820,14 L880,30
             L940,18 L1000,34 L1060,12 L1120,28 L1180,16 L1240,32 L1300,14
             L1360,30 L1410,18 L1440,28 L1440,60 L0,60 Z"
          fill="#f5f0e8"
        />
      </svg>
    </div>
  );
}
