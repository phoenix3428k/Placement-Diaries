"use client";

import Link from "next/link";

export default function DashboardNav() {
  return (
    <nav className="border-b border-gray-800 bg-black">
      <div className="max-w-7xl mx-auto px-4 py-4 flex gap-6">
        <Link href="/dashboard" className="text-white">
          Dashboard
        </Link>

        <Link href="/settings" className="text-gray-400 hover:text-white">
          Settings
        </Link>
      </div>
    </nav>
  );
}