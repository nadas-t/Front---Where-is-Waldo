import { Link, NavLink } from "react-router-dom";

type SiteHeaderProps = {
  compact?: boolean;
};

function SiteHeader({ compact = false }: SiteHeaderProps) {
  return (
    <header
      className={`page-content mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 ${
        compact ? "py-4" : "py-5"
      }`}
    >
      <Link
        aria-label="Onde está Waldo — página inicial"
        className="group inline-flex items-center gap-3"
        to="/"
      >
        <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-waldo-600 text-sm font-black text-white shadow-md shadow-red-900/15 transition group-hover:-rotate-3 group-hover:scale-105">
          W
          <span className="brand-stripes absolute inset-x-0 bottom-0 h-2" />
        </span>
        <span>
          <span className="block text-[0.65rem] font-extrabold uppercase tracking-[0.22em] text-waldo-600">
            Onde está
          </span>
          <span className="block text-lg font-black leading-5 tracking-tight text-navy-900">
            Waldo?
          </span>
        </span>
      </Link>

      <nav aria-label="Navegação principal" className="flex items-center gap-1">
        <NavLink
          className={({ isActive }) =>
            `rounded-full px-3 py-2 text-sm font-bold transition sm:px-4 ${
              isActive
                ? "border border-navy-900 bg-navy-900 !text-white shadow-[0_5px_14px_rgba(13,27,53,0.28)]"
                : "text-navy-700 hover:bg-white hover:text-navy-900"
            }`
          }
          end
          to="/"
        >
          Início
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `rounded-full px-3 py-2 text-sm font-bold transition sm:px-4 ${
              isActive
                ? "border border-navy-900 bg-navy-900 !text-white shadow-[0_5px_14px_rgba(13,27,53,0.28)]"
                : "text-navy-700 hover:bg-white hover:text-navy-900"
            }`
          }
          to="/levels"
        >
          Níveis
        </NavLink>
      </nav>
    </header>
  );
}

export default SiteHeader;
