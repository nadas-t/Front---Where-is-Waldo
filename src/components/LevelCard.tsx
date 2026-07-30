import { Link } from "react-router-dom";

import type { ApiMap } from "../services/api";

type LevelCardProps = {
  level: ApiMap;
};

const difficultyTags: Record<
  string,
  { label: string; className: string }
> = {
  easy: {
    label: "Fácil",
    className: "border-blue-200 bg-blue-100 text-blue-800",
  },
  medium: {
    label: "Médio",
    className: "border-yellow-300 bg-yellow-100 text-yellow-900",
  },
  hard: {
    label: "Difícil",
    className: "border-red-200 bg-red-100 text-red-800",
  },
};

function LevelCard({ level }: LevelCardProps) {
  const difficulty = difficultyTags[level.difficulty] ?? {
    label: level.difficulty,
    className: "border-gray-200 bg-gray-100 text-gray-800",
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-navy-900/10 bg-white shadow-[0_12px_35px_rgba(13,27,53,0.08)] transition duration-300 hover:-translate-y-1.5 hover:border-waldo-500/30 hover:shadow-[0_20px_45px_rgba(13,27,53,0.14)]">
      <Link className="relative block overflow-hidden" to={`/game/${level.id}`}>
        <img
          alt={level.name}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          src={level.imageUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/45 via-transparent to-transparent opacity-70" />
        <span
          className={`absolute right-4 top-4 shrink-0 rounded-full border px-3 py-1.5 text-xs font-extrabold shadow-sm ${difficulty.className}`}
        >
          {difficulty.label}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-black tracking-tight text-navy-900">
            {level.name}
          </h2>
        </div>
        <p className="mt-2 flex-1 text-sm leading-6 text-navy-700/75">
          {level.description}
        </p>
        <Link
          className="mt-5 inline-flex items-center justify-between rounded-xl bg-navy-900 px-4 py-3 text-sm font-extrabold !text-white transition hover:bg-waldo-600"
          to={`/game/${level.id}`}
        >
          Começar desafio
          <span aria-hidden="true" className="text-lg">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

export default LevelCard;
