import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "~/server/better-auth/server";

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect("/listEvents");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-slate-900 selection:bg-slate-100">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-center">
        
        {/* Hero Section */}
        <div className="space-y-6">
          <h1 className="text-6xl font-extralight tracking-tighter sm:text-8xl text-slate-950">
            Set The <span className="font-semibold italic">Date</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-light text-slate-500 sm:text-xl leading-relaxed">
            Curated experiences for the modern romantic and the social explorer. 
            From intimate first dates to curated group gatherings.
          </p>
        </div>

        {/* Feature/Path Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-4">
          <div className="p-6 rounded-xl border border-slate-100 bg-slate-50/50 text-left transition-all hover:border-slate-200">
            <h3 className="font-semibold text-slate-900">Elevated Dating</h3>
            <p className="text-sm text-slate-500 mt-2">Find meaningful connections through focused, one-on-one event bookings.</p>
          </div>
          <div className="p-6 rounded-xl border border-slate-100 bg-slate-50/50 text-left transition-all hover:border-slate-200">
            <h3 className="font-semibold text-slate-900">Social Discovery</h3>
            <p className="text-sm text-slate-500 mt-2">Expand your inner circle with group events designed for meeting new people.</p>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="flex flex-col gap-4 items-center">
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-12 text-sm font-medium text-white transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-slate-200"
          >
            Explore Events
          </Link>
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            Secure · Intentional · Professional
          </p>
        </div>

        {/* Footer */}
        <footer className="fixed bottom-8 text-[10px] font-medium tracking-[0.2em] uppercase text-slate-400">
          © {new Date().getFullYear()} Set The Date Studio
        </footer>
      </div>
    </main>
  );
}