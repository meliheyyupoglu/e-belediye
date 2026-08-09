import { redirect } from "next/navigation";
import { getHaritaSikayet } from "@/lib/harita";

export default function HaritaSikayetTipRedirect({ params }: { params: { tip: string } }) {
  const sikayet = getHaritaSikayet(params.tip);
  if (!sikayet) {
    redirect("/basvuru/harita");
  }
  redirect(`/basvuru/harita?tip=${params.tip}`);
}
