"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/yonetici/cms", label: "CMS" },
  { href: "/yonetici/harita", label: "Harita" },
  { href: "/yonetici/dashboard", label: "Dashboard" },
  { href: "/yonetici/galeri", label: "Galeri" },
] as const;

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function cikis() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/yonetici/login");
    router.refresh();
  }

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {LINKS.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`text-sm px-3 py-1.5 rounded-lg transition ${
              active ? "btn-primary" : "btn-secondary"
            }`}
          >
            {label}
          </Link>
        );
      })}
      <button type="button" onClick={cikis} className="btn-secondary text-sm">
        Çıkış
      </button>
    </nav>
  );
}
