"use client";

import { useEffect } from "react";
import { api } from "~/trpc/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  
  const finalize = api.bookings.finalizeCheckout.useMutation();

  useEffect(() => {
    if (sessionId && !finalize.isPending && !finalize.isSuccess) {
      finalize.mutate({ sessionId });
    }
  }, [sessionId, finalize]);

  if (!sessionId) return null;

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-slate-100 pb-20">
      <nav className="sticky top-0 z-50 border-b border-slate-50 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-xl font-extralight tracking-tighter text-slate-950 mx-auto">
            Set The <span className="font-semibold italic">Date</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-24 text-center max-w-2xl">
        <div className="space-y-8">
          <div className="mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
            {finalize.isPending ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
            ) : (
              <svg className="w-10 h-10 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-extralight tracking-tight text-slate-950 sm:text-5xl">
              {finalize.isPending ? "Confirming..." : "Payment Successful"}
            </h1>
            <p className="text-sm font-light text-slate-500 mx-auto max-w-md">
              {finalize.isPending ? "Please wait while we confirm your booking." : "Thank you for your purchase. Your experience has been booked and you will receive a confirmation email shortly."}
            </p>
          </div>

          {!finalize.isPending && (
            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/bookings"
                className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-8 text-xs font-medium text-white transition-all hover:bg-slate-800"
              >
                View My Bookings
              </Link>
              <Link
                href="/listEvents"
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 px-8 text-xs font-medium text-slate-950 transition-all hover:bg-slate-50"
              >
                Explore More Events
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
