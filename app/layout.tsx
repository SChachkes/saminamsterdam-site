import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Sam in Amsterdam",
  description: "Study abroad site for photos, map, blog, events, notes, trips, and classes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-white to-[#f8fbff] text-neutral-900">
        <div className="h-1 w-full grad-anim" />
        <nav className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-black/5">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link className="font-semibold bg-clip-text text-transparent grad-anim" href="/">Sam in Amsterdam</Link>
            <div className="hidden md:flex gap-4 text-sm">
              <Link href="/photos">Photos</Link>
              <Link href="/map">Map</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/events">Events</Link>
              <Link href="/notes">Notes</Link>
              <Link href="/trips">Trip Planner</Link>
              <Link href="/classes">Classes</Link>
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-8 grid gap-6">{children}</main>
        <footer className="py-10 text-center text-sm text-neutral-500">
          <div>© {new Date().getFullYear()} Sam in Amsterdam</div>
          <div className="mt-1">Daily events publish at 08:00 Europe/Amsterdam.</div>
        </footer>
      </body>
    </html>
  );
}
