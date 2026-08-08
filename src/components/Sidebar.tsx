"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BELEDIYE_ADI, MENU_ITEMS, SISTEM_ADI } from "@/lib/constants";

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex h-full min-h-screen w-64 flex-col border-r border-gray-200 bg-white p-5">
      <div className="mb-6">
        <h2 className="text-base font-bold text-gray-900">{BELEDIYE_ADI}</h2>
        <p className="text-xs text-gray-500">{SISTEM_ADI}</p>
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Menü
      </p>
      <nav className="flex flex-col gap-0.5">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-link ${isActive(item.href) ? "active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-gray-200 pt-4">
        <p className="text-xs text-gray-400">
          &copy; 2026 T.C. Dörtyol Belediyesi
        </p>
      </div>
    </aside>
  );
}
