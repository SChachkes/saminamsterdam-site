'use client';
import { useState } from 'react';

const ACCENT_GRAD = 'bg-gradient-to-r from-[#FF6F61] to-[#00B3FF]';
const ACCENT_TEXT = 'bg-clip-text text-transparent bg-gradient-to-r from-[#FF6F61] to-[#00B3FF]';

function cls(...s: (string|false|undefined)[]) { return s.filter(Boolean).join(' '); }
function Button({ children, onClick, type='button', className='' }:{children:React.ReactNode;onClick?:()=>void;type?:'button'|'submit';className?:string}) {
  return <button type={type} onClick={onClick} className={cls('px-4 py-2 rounded-xl text-white font-medium shadow hover:opacity-95 transition', ACCENT_GRAD, className)}>{children}</button>;
}
function Section({ title, desc, children }:{title:string;desc?:string;children:React.ReactNode}) {
  return (
    <section className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-sm border border-black/5">
      <div className="mb-3">
        <h2 className="text-xl font-semibold"><span className={ACCENT_TEXT}>{title}</span></h2>
        {desc && <p className="text-sm text-neutral-600 mt-1">{desc}</p>}
      </div>
      {children}
    </section>
  );
}

// demo seed so the right-side card is not empty at first
const DEMO_TRIPS = [
  { id: 1, name: "Utrecht Day Trip", dates: "2025-09-06", notes: "Train from Centraal. Budget €60.", food: ["Broodje Ben"], itinerary: ["DOMunder tour", "Canal boat"], checklist: ["Book tickets", "Charge phone"] },
];

export default function TripsPage() {
  const [trips, setTrips] = useState(DEMO_TRIPS);
  const [draft, setDraft] = useState({ name: "", dates: "", notes: "", food: "", itinerary: "", checklist: "" });

  const addTrip = () => {
    if (!draft.name) return;
    const trip = {
      id: Math.random(),
      name: draft.name,
      dates: draft.dates,
      notes: draft.notes,
      food: draft.food ? draft.food.split(",").map(s => s.trim()).filter(Boolean) : [],
      itinerary: draft.itinerary ? draft.itinerary.split(",").map(s => s.trim()).filter(Boolean) : [],
      checklist: draft.checklist ? draft.checklist.split(",").map(s => s.trim()).filter(Boolean) : [],
    };
    setTrips(t => [trip, ...t]);
    setDraft({ name: "", dates: "", notes: "", food: "", itinerary: "", checklist: "" });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-6">
      <Section title="Add trip" desc="Each trip saved as its own plan">
        <div className="grid gap-2">
          <input value={draft.name} onChange={e=>setDraft({...draft, name:e.target.value})} placeholder="Trip name (e.g., Haarlem Saturday)" className="px-3 py-2 rounded-xl border border-black/10" />
          <input value={draft.dates} onChange={e=>setDraft({...draft, dates:e.target.value})} placeholder="Dates" className="px-3 py-2 rounded-xl border border-black/10" />
          <textarea value={draft.notes} onChange={e=>setDraft({...draft, notes:e.target.value})} placeholder="Budget notes, trains, must-sees…" className="px-3 py-2 rounded-xl border border-black/10 min-h-[90px]" />
          <input value={draft.food} onChange={e=>setDraft({...draft, food:e.target.value})} placeholder="Food (comma-separated)" className="px-3 py-2 rounded-xl border border-black/10" />
          <input value={draft.itinerary} onChange={e=>setDraft({...draft, itinerary:e.target.value})} placeholder="Itinerary items (comma-separated)" className="px-3 py-2 rounded-xl border border-black/10" />
          <input value={draft.checklist} onChange={e=>setDraft({...draft, checklist:e.target.value})} placeholder="Checklist (comma-separated)" className="px-3 py-2 rounded-xl border border-black/10" />
          <Button onClick={addTrip}>Save trip</Button>
        </div>
      </Section>

      <Section title="Trips">
        <div className="space-y-3">
          {trips.map(t => (
            <div key={t.id} className="p-4 rounded-2xl border border-black/10 bg-white/70">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-neutral-500">{t.dates}</div>
              </div>
              {t.notes && <div className="text-sm text-neutral-700 mt-1">{t.notes}</div>}
              {t.food?.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-neutral-500">Food</div>
                  <ul className="list-disc ml-5 text-sm">{t.food.map((f,i)=><li key={i}>{f}</li>)}</ul>
                </div>
              )}
              {t.itinerary?.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-neutral-500">Itinerary</div>
                  <ul className="list-disc ml-5 text-sm">{t.itinerary.map((f,i)=><li key={i}>{f}</li>)}</ul>
                </div>
              )}
              {t.checklist?.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-neutral-500">Checklist</div>
                  <ul className="list-disc ml-5 text-sm">{t.checklist.map((f,i)=><li key={i}>{f}</li>)}</ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}