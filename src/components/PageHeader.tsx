import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <div className="page-header mb-6 sm:mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-3 flex flex-wrap items-center gap-1 text-sm text-blue-200">
          <Link href="/" className="hover:text-white transition">
            Ana Sayfa
          </Link>
          {breadcrumbs.map((item, i) => (
            <span key={i} className="flex items-center gap-1">
              <span>/</span>
              {item.href ? (
                <Link href={item.href} className="hover:text-white transition">
                  {item.label}
                </Link>
              ) : (
                <span className="text-white">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-sm sm:text-base text-blue-100 max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
}
