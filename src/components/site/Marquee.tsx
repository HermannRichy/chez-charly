const WORDS = [
  "ATTIÉKÉ POISSON",
  "RIZ AILERON",
  "ALLOCO BRÛLANT",
  "PIRON",
  "BOMIWOR",
  "SPAGHETTI OMELETTE",
];

export function Marquee() {
  const line = (
    <>
      {WORDS.map((w, i) => (
        <span key={i} className="inline-flex items-center gap-11">
          <span>{w}</span>
          <span className="text-orange">★</span>
        </span>
      ))}
    </>
  );

  return (
    <div className="bg-deep py-3.75 overflow-hidden whitespace-nowrap">
      <div className="animate-marquee inline-flex gap-11 pr-11 font-grifter text-[22px] text-[#FFD9C4] tracking-[.02em]">
        {line}
        {line}
      </div>
    </div>
  );
}
