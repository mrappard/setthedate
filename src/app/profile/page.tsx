import { redirect } from "next/navigation";
import { getSession } from "~/server/better-auth/server";
import { ProfileForm } from "./profile-form";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-slate-100">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 border-b border-slate-50 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/listEvents" className="text-xl font-extralight tracking-tighter text-slate-950">
            Set The <span className="font-semibold italic">Date</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/listEvents" className="text-sm font-light text-slate-500 hover:text-slate-950 transition-colors">
              Events
            </Link>
            <div className="h-8 w-8 rounded-full bg-slate-950 border border-slate-950" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16 sm:px-6 flex flex-col items-center">
        <header className="mb-16 text-center space-y-4">
          <h2 className="text-sm font-light uppercase tracking-[0.4em] text-slate-400">Settings</h2>
          <h1 className="text-5xl font-extralight tracking-tight text-slate-950 sm:text-6xl">
            Personal <span className="italic">Profile</span>
          </h1>
          <p className="max-w-md mx-auto text-slate-500 font-light text-sm">
            Complete your profile to unlock curated experiences and meaningful connections.
          </p>
        </header>

        <ProfileForm user={session.user} />
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
