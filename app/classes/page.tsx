export default function ClassesPage() {
  const classes = [
    { course: "Dutch A1", when: "Mon/Wed 18:00", where: "UvA – B2.03", note: "Bring ID" },
    { course: "Urban Planning Seminar", when: "Fri 10:00", where: "BG 1.05", note: "" },
  ];

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Classes</h1>
      <div className="grid gap-3">
        {classes.map((c) => (
          <div key={c.course} className="border border-black/10 rounded-2xl p-4 bg-white/70">
            <div className="font-medium">{c.course}</div>
            <div className="text-sm text-black/70">{c.when} · {c.where}</div>
            {c.note && <div className="text-sm mt-1">{c.note}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}