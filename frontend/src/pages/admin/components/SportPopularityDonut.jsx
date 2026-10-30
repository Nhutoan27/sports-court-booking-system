export default function SportPopularityDonut({ data }) {
  const stops = [];
  let cumulative = 0;
  for (const item of data) {
    const start = cumulative;
    const end = start + item.percent;
    stops.push(`${item.color} ${start}% ${end}%`);
    cumulative = end;
  }
  const gradientStops = stops.join(', ');

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="size-40 rounded-full"
        style={{
          background: `conic-gradient(${gradientStops})`,
          WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 28px), #000 calc(100% - 28px))',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 28px), #000 calc(100% - 28px))',
        }}
        role="img"
        aria-label="Sport popularity breakdown"
      />
      <div className="flex flex-wrap justify-center gap-4">
        {data.map((item) => (
          <span key={item.sport} className="flex items-center gap-1.5 text-sm text-ink-muted">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            {item.sport} ({item.percent}%)
          </span>
        ))}
      </div>
    </div>
  );
}

