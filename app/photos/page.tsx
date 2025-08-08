export default function PhotosPage() {
  const images = [
    "/photos/canals-1.jpg",
    "/photos/bikes-1.jpg",
    "/photos/sunset-1.jpg",
  ];

  return (
    <section className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Photos</h1>
      <p className="text-sm text-black/60 mb-4">Drop JPGs in <code>/public/photos</code> and list them here.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((src) => (
          <img key={src} src={src} alt="" className="w-full h-48 object-cover rounded-2xl border border-black/10" />
        ))}
      </div>
    </section>
  );
}