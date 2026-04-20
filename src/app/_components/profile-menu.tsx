"use client";

import { authClient } from "~/server/better-auth/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function ProfileMenu({ image }: { image?: string | null }) {
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
    <div className="relative group">
      <button className="h-8 w-8 rounded-full border border-slate-200 bg-slate-100 overflow-hidden focus:outline-none">
        {image && (
          <Image src={image} alt="Profile" width={32} height={32} unoptimized className="object-cover" />
        )}
      </button>
      <div className="absolute right-0 top-10 hidden w-32 rounded-xl border border-slate-100 bg-white p-2 shadow-lg group-hover:block">
        <button
          onClick={handleLogout}
          className="block w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
