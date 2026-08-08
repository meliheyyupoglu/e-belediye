import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/yonetici/login");
  return <>{children}</>;
}
