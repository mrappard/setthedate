"use client";

import Image from "next/image";
import Link from "next/link";
import { api } from "~/trpc/react";

export function CartContent() {
  const utils = api.useUtils();
  const { data: items, isLoading } = api.shoppingCart.getCart.useQuery();
  
  const removeMutation = api.shoppingCart.removeFromCart.useMutation({
    onSuccess: () => {
      void utils.shoppingCart.getCart.invalidate();
    },
  });

  const clearMutation = api.shoppingCart.clearCart.useMutation({
    onSuccess: () => {
      void utils.shoppingCart.getCart.invalidate();
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-slate-50 p-6">
          <svg className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-light text-slate-900">Your cart is empty</h2>
          <p className="text-sm text-slate-500">Discover amazing events and start planning your next experience.</p>
        </div>
        <Link
          href="/listEvents"
          className="mt-4 inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-8 text-xs font-medium text-white transition-all hover:bg-slate-800"
        >
          Browse Events
        </Link>
      </div>
    );
  }

  const total = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-sm font-light uppercase tracking-[0.3em] text-slate-400">Items ({items.length})</h2>
          <button 
            onClick={() => clearMutation.mutate()}
            className="text-[10px] font-medium uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div 
              key={`${item.eventId}-${item.optionId}-${index}`}
              className="group flex items-center gap-6 rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-slate-200 hover:shadow-sm"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  unoptimized
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between py-1">
                <div className="space-y-1">
                  <h3 className="font-medium text-slate-900 line-clamp-1">{item.name}</h3>
                  <p className="text-xs font-light text-slate-500 uppercase tracking-wider">{item.optionName}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-light text-slate-950">${item.price}</span>
                  <button
                    onClick={() => removeMutation.mutate({ eventId: item.eventId, optionId: item.optionId })}
                    className="text-[10px] font-medium uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-3xl border border-slate-100 bg-slate-50/50 p-8 space-y-8">
          <h2 className="text-sm font-light uppercase tracking-[0.3em] text-slate-400">Order Summary</h2>
          
          <div className="space-y-4 border-b border-slate-200 pb-8">
            <div className="flex justify-between text-sm">
              <span className="font-light text-slate-500">Subtotal</span>
              <span className="text-slate-900">${total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-light text-slate-500">Processing Fee</span>
              <span className="text-slate-900">$0.00</span>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <span className="text-sm font-light text-slate-500">Total</span>
            <span className="text-3xl font-light text-slate-950">${total}</span>
          </div>

          <button
            onClick={() => {
                // TODO: Implement checkout
                alert("Checkout not implemented yet");
            }}
            className="w-full inline-flex h-14 items-center justify-center rounded-full bg-slate-950 text-xs font-medium text-white transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]"
          >
            Checkout with Stripe
          </button>

          <p className="text-[10px] text-center font-light text-slate-400 px-4">
            By proceeding you agree to our terms of service and refund policy.
          </p>
        </div>
      </div>
    </div>
  );
}
