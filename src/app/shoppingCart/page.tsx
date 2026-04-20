import { getSession } from "~/server/better-auth/server";
import { api, HydrateClient } from "~/trpc/server";
import { CartContent } from "./cart-content";
import { ProfileHeader } from "../_components/profile-header";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ShoppingCart() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Prefetch cart data
  void api.shoppingCart.getCart.prefetch();

  return (
    <HydrateClient>
      <main className="min-h-screen bg-white text-slate-900 selection:bg-slate-100 pb-20">
        {/* Navigation Header */}
        <nav className="sticky top-0 z-50 border-b border-slate-50 bg-white/80 backdrop-blur-md">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
            <Link href="/listEvents" className="flex items-center gap-2 text-sm font-light text-slate-500 hover:text-slate-950 transition-colors">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              Continue Browsing
            </Link>
            <Link href="/" className="text-xl font-extralight tracking-tighter text-slate-950 absolute left-1/2 -translate-x-1/2">
              Set The <span className="font-semibold italic">Date</span>
            </Link>
            <ProfileHeader image={session.user.image} />
          </div>
        </nav>

        <div className="container mx-auto px-4 pt-12 sm:px-6 max-w-6xl">
          <div className="space-y-12">
            <header className="space-y-4">
              <h1 className="text-4xl font-extralight tracking-tight text-slate-950 sm:text-5xl">
                Your <span className="italic font-medium">Cart</span>
              </h1>
              <p className="text-sm font-light text-slate-500 max-w-md">
                Review your selected experiences and proceed to secure checkout.
              </p>
            </header>

            <CartContent />
          </div>
        </div>

        {/* Footer */}
        <footer className="container mx-auto mt-20 text-center">
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-slate-300">
            © {new Date().getFullYear()} Set The Date Studio
          </p>
        </footer>
      </main>
    </HydrateClient>
  );
}
