"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "~/trpc/react";

interface UserProfile {
  name?: string | null;
  image?: string | null;
  email?: string | null;
}

const RACE_OPTIONS = [
  "American Indian or Alaska Native",
  "Asian",
  "Black or African American",
  "Hispanic or Latino",
  "Native Hawaiian or Other Pacific Islander",
  "White",
  "Other"
];

const RELIGION_OPTIONS = [
  "Christianity",
  "Islam",
  "Hinduism",
  "Buddhism",
  "Judaism",
  "Sikhism",
  "Atheism / Agnosticism",
  "Spiritual but not religious",
  "Other"
];

export function ProfileForm({ user }: { user: UserProfile }) {
  const [preview, setPreview] = useState<string | null>(user.image ?? null);

  const {data} = api.profile.getProfile.useQuery();
  
  
  return (
    <form className="w-full max-w-2xl space-y-12">
      {/* Profile Picture Section */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative h-32 w-32 overflow-hidden rounded-full border border-slate-200 bg-slate-50 shadow-inner group cursor-pointer">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
//              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
            Upload
          </div>
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
        </div>
        <p className="text-[10px] font-medium tracking-widest uppercase text-slate-400">Profile Image</p>
      </div>

      {/* Basic Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-widest text-slate-400">Full Name</label>
          <input
            type="text"
            defaultValue={user.name ?? ""}
            className="w-full border-b border-slate-200 bg-transparent py-2 text-slate-900 focus:border-slate-950 focus:outline-none transition-colors font-light"
            placeholder="Jane Doe"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-widest text-slate-400">Birth Date</label>
          <input
            type="date"
            className="w-full border-b border-slate-200 bg-transparent py-2 text-slate-900 focus:border-slate-950 focus:outline-none transition-colors font-light appearance-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-widest text-slate-400">Salary (Annual)</label>
          <input
            type="text"
            className="w-full border-b border-slate-200 bg-transparent py-2 text-slate-900 focus:border-slate-950 focus:outline-none transition-colors font-light"
            placeholder="$120,000"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-widest text-slate-400">Race / Ethnicity</label>
          <select className="w-full border-b border-slate-200 bg-transparent py-2 text-slate-900 focus:border-slate-950 focus:outline-none transition-colors font-light cursor-pointer">
            <option value="" disabled>Select...</option>
            {RACE_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-widest text-slate-400">Religion</label>
          <select className="w-full border-b border-slate-200 bg-transparent py-2 text-slate-900 focus:border-slate-950 focus:outline-none transition-colors font-light cursor-pointer">
            <option value="" disabled >Select...</option>
            {RELIGION_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-widest text-slate-400">Height</label>
          <input
            type="text"
            className="w-full border-b border-slate-200 bg-transparent py-2 text-slate-900 focus:border-slate-950 focus:outline-none transition-colors font-light"
            placeholder="5&apos;10&quot;"
          />
        </div>
      </div>

      {/* Text Areas */}
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-widest text-slate-400">What I&apos;m Looking For</label>
          <textarea
            rows={4}
            className="w-full border border-slate-100 bg-slate-50/50 rounded-xl p-4 text-slate-900 focus:border-slate-950 focus:outline-none transition-colors font-light resize-none"
            placeholder="Describe your ideal partner or experience..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-8">
        <button
          type="button"
          className="flex-1 h-12 rounded-full bg-slate-950 text-white text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
        >
          Save Profile
        </button>
        <Link
          href="/listEvents"
          className="flex-1 h-12 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
