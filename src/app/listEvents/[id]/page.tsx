import Image from "next/image";
import Link from "next/link";
import { getSession } from "~/server/better-auth/server";
import { redirect, notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { BookingSection } from "./booking-section";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SpecificEvent({ params }: PageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const event = await api.events.getEventById({ id });

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-slate-100 pb-20">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 border-b border-slate-50 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/listEvents" className="flex items-center gap-2 text-sm font-light text-slate-500 hover:text-slate-950 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </Link>
          <Link href="/" className="text-xl font-extralight tracking-tighter text-slate-950 absolute left-1/2 -translate-x-1/2">
            Set The <span className="font-semibold italic">Date</span>
          </Link>
          <div className="h-8 w-8 rounded-full border border-slate-200 bg-slate-100 overflow-hidden">
            {session.user.image && (
              <Image src={session.user.image} alt="Profile" width={32} height={32} unoptimized className="object-cover" />
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <Image
          src={event.image}
          alt={event.name}
          fill
          priority
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10 sm:px-6 max-w-5xl">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="rounded-full bg-slate-100 px-4 py-1 text-[10px] font-medium uppercase tracking-widest text-slate-500">
                {event.category}
              </span>
              <span className="text-sm font-light text-slate-400">{event.date}</span>
            </div>
            <h1 className="text-4xl font-extralight tracking-tight text-slate-950 sm:text-6xl">
              {event.name}
            </h1>
          </div>

          {/* Description */}
          <div className="max-w-3xl">
            <p className="text-lg font-light text-slate-600 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Purchase Options (Client Side) */}
          <BookingSection event={{
            id: event.id,
            name: event.name,
            image: event.image,
            options: event.options?.map(o => ({
              id: o.id,
              name: o.name,
              price: o.price,
              description: o.description
            }))
          }} />
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto mt-20 text-center">
        <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-slate-300">
          © {new Date().getFullYear()} Set The Date Studio
        </p>
      </footer>
    </main>
  );
}
