"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

interface BookingSectionProps {
  event: {
    id: string;
    name: string;
    image: string;
    options?: {
      id: string;
      name: string;
      price: number;
      description: string;
    }[];
  };
}

export function BookingSection({ event }: BookingSectionProps) {
  const router = useRouter();
  const addToCart = api.shoppingCart.addToCart.useMutation({
    onSuccess: () => {
      // Use the spelling from the directory structure
      router.push("/shoppingCart");
    },
    onError: (error) => {
      alert(`Failed to add to cart: ${error.message}`);
    }
  });

  const handleBook = (option: { id: string, name: string, price: number }) => {
    addToCart.mutate({
      eventId: event.id,
      optionId: option.id,
      name: event.name,
      optionName: option.name,
      price: option.price,
      image: event.image,
    });
  };

  return (
    <div className="space-y-6 pt-8 border-t border-slate-50">
      <h2 className="text-sm font-light uppercase tracking-[0.3em] text-slate-400">Selection Options</h2>
      <div className="grid grid-cols-1 gap-4">
        {event.options?.map((option) => (
          <div key={option.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl border border-slate-100 bg-slate-50/30 transition-all hover:bg-slate-50 hover:border-slate-200">
            <div className="space-y-1 pr-8">
              <h3 className="font-medium text-slate-900">{option.name}</h3>
              <p className="text-sm font-light text-slate-500">{option.description}</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xl font-light text-slate-950">${option.price}</span>
              <button
                onClick={() => handleBook(option)}
                disabled={addToCart.isPending}
                className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-8 text-xs font-medium text-white transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] disabled:bg-slate-400"
              >
                {addToCart.isPending ? "Adding..." : "Book Experience"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
