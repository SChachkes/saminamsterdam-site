export default function EventsPage() {
  const events = [
    { date: "2025-09-04", title: "Concert @ Paradiso", where: "Leidseplein", link: "#" },
    { date: "2025-09-10", title: "Saturday Market", where: "Noordermarkt", link: "#" },
  ];

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Events</h1>
      <ul className="space-y-3">
        {events.map((e) => (
          <li key={`${e.date}-${e.title}`} className="border border-black/10 rounded-2xl p-4 bg-white/70">
            <div className="text-xs text-black/50">{e.date}</div>
            <div className="font-medium">{e.title}</div>
            <div className="text-sm text-black/70">{e.where}</div>
            {e.link && <a className="text-sm underline mt-1 inline-block" href={e.link}>Details</a>}
          </li>
        ))}
      </ul>
    </section>
  );
}