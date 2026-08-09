import Image from "next/image";
import { BELEDIYE_ADI, SISTEM_ADI } from "@/lib/constants";
import HeroSearch from "@/components/HeroSearch";

export default function HomeHero() {
  return (
    <section className="relative z-30 min-h-[480px] sm:min-h-[540px] md:min-h-[580px] flex items-center -mt-[108px] pt-[108px] isolate">
      <Image
        src="/hero-dortyol-portakal.png"
        alt="Dörtyol portakal bahçeleri"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

      <div className="site-container relative z-10 w-full py-16 sm:py-20 md:py-28">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            {BELEDIYE_ADI}
            <span className="mt-2 block text-2xl font-semibold text-blue-100 sm:text-3xl md:text-4xl">
              e-Belediye Hizmetleri
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
            {SISTEM_ADI}. Belediye hizmetlerine hızlı ve kolay erişin, işlemlerinizi
            online olarak gerçekleştirin.
          </p>
          <HeroSearch />
        </div>
      </div>
    </section>
  );
}
