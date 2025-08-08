export default function BlogPage() {
  const posts = [
    {
      title: "Landing in AMS",
      date: "2025-08-01",
      summary: "First few days: jetlag, bikes, and bitterballen.",
      href: "#"
    },
    {
      title: "Canals at Golden Hour",
      date: "2025-08-06",
      summary: "Photos from Jordaan & De 9 Straatjes.",
      href: "#"
    }
  ];

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Blog</h1>
      <p className="text-sm text-black/60 mb-6">
        Notes and photos from life in Amsterdam.
      </p>

      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.title} className="border border-black/10 rounded-2xl p-4 bg-white/70">
            <div className="text-xs text-black/50">{p.date}</div>
            <h2 className="text-lg font-medium">{p.title}</h2>
            <p className="text-sm text-black/70">{p.summary}</p>
            {p.href && (
              <a className="inline-block mt-2 text-sm underline" href={p.href}>
                Read more
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}