import { getSession } from "~/server/better-auth/server";
import { api, HydrateClient } from "~/trpc/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfileHeader } from "../_components/profile-header";
import Image from "next/image";

export default async function BookingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch bookings server-side
  const bookings = await api.bookings.getMyBookings();

  return (
    <HydrateClient>
      <main className="min-h-screen bg-white text-slate-900 pb-20">
        <nav className="sticky top-0 z-50 border-b border-slate-50 bg-white/80 backdrop-blur-md">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
            <Link href="/" className="text-xl font-extralight tracking-tighter text-slate-950">
              Set The <span className="font-semibold italic">Date</span>
            </Link>
            <ProfileHeader image={session.user.image} showBookings={false} />
          </div>
        </nav>

        <div className="container mx-auto px-4 pt-12 sm:px-6 max-w-4xl">
          <h1 className="text-4xl font-extralight tracking-tight text-slate-950 mb-12">
            My <span className="italic font-medium">Bookings</span>
          </h1>

          {bookings.length === 0 ? (
            <div className="text-center py-20 border border-slate-100 rounded-3xl bg-slate-50/50">
                <p className="text-slate-500 font-light">You have no bookings yet.</p>
                <Link href="/listEvents" className="mt-4 inline-block text-sm underline decoration-slate-300 underline-offset-4 text-slate-900">Browse Events</Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="rounded-3xl border border-slate-100 p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
                      <h2 className="text-xl font-medium mt-1">Order #{booking.stripeSessionId.slice(-8).toUpperCase()}</h2>
                    </div>
                    <span className="text-lg font-light">${booking.total}</span>
                  </div>
                  
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    {booking.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0">
                            <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.optionName}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </HydrateClient>
  );
}
