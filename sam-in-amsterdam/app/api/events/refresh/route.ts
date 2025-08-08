import { NextResponse } from "next/server";

// This route is triggered daily at 08:00 Europe/Amsterdam (see vercel.json).
// Fill in with your event sources (e.g., Ticketmaster, Eventbrite, Meetup, Resident Advisor, museum feeds).
// Save into Supabase then revalidate the /events page.

export async function GET() {
  // TODO: fetch events from sources, write to Supabase
  // Example (pseudo):
  // const events = await fetchEvents();
  // await supabase.from('events').upsert(events);
  // await revalidatePath('/events');
  return NextResponse.json({ ok: true, ranAt: new Date().toISOString() });
}
