import Image from "next/image";
import Link from "next/link";
import { getSession } from "~/server/better-auth/server";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

export default async function ListEvents() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const events = await api.events.getEvents();

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-slate-100">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 border-b border-slate-50 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-xl font-extralight tracking-tighter text-slate-950">
            Set The <span className="font-semibold italic">Date</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/shoppingCart" className="text-slate-500 hover:text-slate-950 transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </Link>
            <Link href="/profile" className="flex items-center gap-3 text-sm font-light text-slate-500 hover:text-slate-950 transition-colors">
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "Profile"}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-slate-400">
                    {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                )}
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12 sm:px-6">
        <header className="mb-12 space-y-2">
          <h2 className="text-sm font-light uppercase tracking-[0.3em] text-slate-400">Upcoming</h2>
          <h1 className="text-4xl font-extralight tracking-tight text-slate-950 sm:text-5xl">
            Curated <span className="italic">Experiences</span>
          </h1>
        </header>

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-2">
          {events.map((event) => (
            <div key={event.id} className="group flex flex-col space-y-4">
              {/* Image Container */}
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100 border border-slate-100 transition-all group-hover:shadow-xl group-hover:shadow-slate-100">
                <Image
                  src={event.image}
                  alt={event.name}
                  width={800}
                  height={450}
                  unoptimized
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 rounded-full bg-white/90 backdrop-blur-sm px-4 py-1 text-[10px] font-medium uppercase tracking-widest text-slate-900 shadow-sm">
                  {event.category}
                </div>
              </div>

              {/* Event Details */}
              <div className="flex justify-between items-start pt-2">
                <div className="space-y-1">
                  <h3 className="text-xl font-light text-slate-950 leading-tight tracking-tight">
                    {event.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm font-light text-slate-400">
                    <span>{event.date}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-200" />
                    <span className="text-slate-900 font-medium">{event.price}</span>
                  </div>
                </div>
                
                <Link
                  href={`/listEvents/${event.id}`}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-xs font-medium text-slate-950 transition-all hover:bg-slate-950 hover:text-white hover:border-slate-950"
                >
                  Show me more
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto mt-20 border-t border-slate-50 px-4 py-12 text-center sm:px-6">
        <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-slate-300">
          © {new Date().getFullYear()} Set The Date Studio
        </p>
      </footer>
    </main>
  );
}
