import { Suspense } from "react";
import Upcoming from "@/components/upcoming";

export default function Page() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-sm border border-black/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold bg-clip-text text-transparent grad-anim">About</h2>
        </div>
        <p className="text-neutral-700 leading-relaxed">
          I’m Sam, spending next semester in Amsterdam with the CIEE program while at Brown (via UVA). I’ll be biking canals,
          chasing art, and taste-testing apple pie. This site tracks photos, pins on a map, class bits (private),
          a guestbook, and a daily events topline.
        </p>
        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl border border-black/10 bg-white/70">
            <div className="text-xs text-neutral-500">Next assignment</div>
            <div className="font-semibold mt-1">—</div>
            <div className="text-xs text-neutral-500">Due —</div>
          </div>
          <div className="p-4 rounded-2xl border border-black/10 bg-white/70">
            <div className="text-xs text-neutral-500">Upcoming</div>
            <div className="font-semibold mt-1">—</div>
            <div className="text-xs text-neutral-500">—</div>
          </div>
          <div className="p-4 rounded-2xl border border-black/10 bg-white/70">
            <div className="text-xs text-neutral-500">Daily topline</div>
            <div className="font-semibold mt-1">Publishes 08:00 Europe/Amsterdam</div>
            <div className="text-xs text-neutral-500">Nightlife • Food • Culture</div>
          </div>
        </div>
      </section>
      <section className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-sm border border-black/5">
        <h2 className="text-xl font-semibold bg-clip-text text-transparent grad-anim mb-3">Latest blog</h2>
        <Suspense fallback={<div className="text-sm text-neutral-500">Loading…</div>}>
          <Upcoming />
        </Suspense>
      </section>
    </div>
  );
}
