export default function Upcoming() {
  return (
    <div className="grid gap-3">
      <article className="p-4 rounded-2xl border border-black/10 bg-white/70">
        <div className="text-sm text-neutral-500">2025-08-31</div>
        <h3 className="font-semibold text-lg mt-1">Landing in AMS</h3>
        <p className="text-sm text-neutral-700 mt-1">First bike ride, first stroopwafel.</p>
      </article>
      <article className="p-4 rounded-2xl border border-black/10 bg-white/70">
        <div className="text-sm text-neutral-500">2025-09-03</div>
        <h3 className="font-semibold text-lg mt-1">Canals at Golden Hour</h3>
        <p className="text-sm text-neutral-700 mt-1">A loop from Jordaan to De Pijp.</p>
      </article>
    </div>
  );
}
