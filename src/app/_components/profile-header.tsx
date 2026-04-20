"use client";

import { authClient } from "~/server/better-auth/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface ProfileHeaderProps {
  image?: string | null;
  showBookings?: boolean;
}

export function ProfileHeader({ image, showBookings = true }: ProfileHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  return (
    <div className="flex items-center gap-4">
      {showBookings ? (
        <Link href="/bookings" className="text-slate-500 hover:text-slate-950 transition-colors" title="My Bookings">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </Link>
      ) : (
        <Link href="/shoppingCart" className="text-slate-500 hover:text-slate-950 transition-colors" title="My Cart">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </Link>
      )}
      <button
        onClick={handleLogout}
        className="text-slate-500 hover:text-red-600 transition-colors"
        title="Sign Out"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
      <Link href="/profile" className="h-8 w-8 rounded-full border border-slate-200 bg-slate-100 overflow-hidden focus:outline-none">
        {image && (
          <Image src={image} alt="Profile" width={32} height={32} unoptimized className="object-cover" />
        )}
      </Link>
    </div>
  );
}
