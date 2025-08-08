export default function NotesPage() {
  const notes = [
    "Albert Cuyp market stroopwafels > everything.",
    "Best bike routes: Vondelpark → Sloterplas → back via Rembrandtpark.",
    "Bring cash for tiny cafés; card is fine most places though."
  ];

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Notes</h1>
      <ul className="list-disc pl-6 space-y-2 text-[15px]">
        {notes.map((n, i) => <li key={i}>{n}</li>)}
      </ul>
    </section>
  );
}