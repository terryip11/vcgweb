interface PageHeroProps {
  badge?: string;
  title: string;
  subtitle?: string;
}

export default function PageHero({ badge, title, subtitle }: PageHeroProps) {
  return (
    <section className="bg-gradient-to-br from-[#0c2340] via-[#123a6b] to-[#1a5080] px-4 py-12 sm:py-14">
      <div className="mx-auto max-w-6xl">
        {badge && (
          <span className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100">
            {badge}
          </span>
        )}
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-sm text-blue-100 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
