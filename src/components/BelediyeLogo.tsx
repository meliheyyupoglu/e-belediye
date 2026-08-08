import { BELEDIYE_ADI } from "@/lib/constants";

interface BelediyeLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { icon: 32, title: "text-xs", subtitle: "text-[10px]" },
  md: { icon: 40, title: "text-sm md:text-base", subtitle: "text-xs" },
  lg: { icon: 48, title: "text-base md:text-lg", subtitle: "text-sm" },
};

export default function BelediyeLogo({
  className = "",
  showText = true,
  size = "md",
}: BelediyeLogoProps) {
  const s = SIZES[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="shrink-0"
      >
        <path
          d="M24 2L6 10v12c0 11.046 7.611 21.388 18 24 10.389-2.612 18-12.954 18-24V10L24 2z"
          fill="#084298"
          stroke="#0d6efd"
          strokeWidth="1.5"
        />
        <path
          d="M24 8l-10 5v9c0 7.2 4.8 14 10 16 5.2-2 10-8.8 10-16v-9l-10-5z"
          fill="#0d6efd"
          opacity="0.3"
        />
        <rect x="16" y="22" width="16" height="14" rx="1" fill="white" />
        <rect x="18" y="24" width="3" height="3" fill="#084298" />
        <rect x="22.5" y="24" width="3" height="3" fill="#084298" />
        <rect x="27" y="24" width="3" height="3" fill="#084298" />
        <rect x="18" y="29" width="3" height="3" fill="#084298" />
        <rect x="22.5" y="29" width="3" height="3" fill="#084298" />
        <rect x="27" y="29" width="3" height="3" fill="#084298" />
        <path d="M14 36h20" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M24 14v4M20 16h8"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <div className="min-w-0">
          <p className={`font-bold text-gray-900 leading-tight ${s.title}`}>
            {BELEDIYE_ADI}
          </p>
          <p className={`text-gray-500 hidden sm:block ${s.subtitle}`}>
            e-Belediye Portalı
          </p>
        </div>
      )}
    </div>
  );
}
