import { useEffect, useState } from "react";

import { listScores, type ApiScore } from "../services/api";

type LeaderBoardProps = {
  mapId: string;
  refreshKey?: number;
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function LeaderBoard({ mapId, refreshKey = 0 }: LeaderBoardProps) {
  const [scores, setScores] = useState<ApiScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const averageTimeSeconds =
    scores.length > 0
      ? Math.round(
          scores.reduce((total, score) => total + score.timeSeconds, 0) /
            scores.length,
        )
      : null;

  useEffect(() => {
    let isCurrent = true;

    queueMicrotask(() => {
      if (isCurrent) {
        setIsLoading(true);
        setErrorMessage("");
      }
    });

    listScores(mapId)
      .then((scoresData) => {
        if (isCurrent) {
          setScores(scoresData);
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar o placar.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [mapId, refreshKey]);

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-navy-900/10 bg-white shadow-[0_12px_40px_rgba(13,27,53,0.07)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-900/10 bg-navy-50/70 px-5 py-4 sm:px-6">
        <div>
          <p className="eyebrow">Ranking</p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-navy-900">
            Melhores tempos
          </h2>
        </div>
        {averageTimeSeconds !== null && (
          <p className="rounded-xl border border-navy-900/10 bg-white px-3 py-2 text-xs font-bold text-navy-700 shadow-sm">
            Média{" "}
            <span className="ml-1 font-mono text-sm text-navy-900">
              {formatTime(averageTimeSeconds)}
            </span>
          </p>
        )}
      </div>

      {isLoading && (
        <div className="space-y-2 p-5 sm:p-6" aria-label="Carregando placar">
          {[0, 1, 2].map((item) => (
            <div className="skeleton h-14 rounded-xl" key={item} />
          ))}
        </div>
      )}

      {errorMessage && (
        <div className="m-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800 sm:m-6">
          <span className="font-black">Não foi possível carregar o placar.</span>
          <span className="mt-1 block text-red-700/80">{errorMessage}</span>
        </div>
      )}

      {!isLoading && !errorMessage && scores.length === 0 && (
        <div className="px-5 py-10 text-center sm:px-6">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-waldo-50 text-2xl">
            🏁
          </span>
          <p className="mt-3 font-bold text-navy-900">O placar está esperando.</p>
          <p className="mt-1 text-sm text-navy-700/70">
            Complete este nível e inaugure o ranking.
          </p>
        </div>
      )}

      {!isLoading && !errorMessage && scores.length > 0 && (
        <ol className="divide-y divide-navy-900/7 px-5 sm:px-6">
          {scores.map((score, index) => (
            <li
              className="flex items-center gap-3 py-3.5 text-sm"
              key={score.id}
            >
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-black ${
                  index === 0
                    ? "bg-amber-100 text-amber-800"
                    : "bg-navy-50 text-navy-700"
                }`}
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-waldo-800">
                  {score.playerName}
                </span>
                <span className="mt-0.5 block text-xs text-navy-500/65">
                  {formatDate(score.createdAt)}
                </span>
              </span>
              <span className="shrink-0 font-mono font-bold text-navy-900">
                {formatTime(score.timeSeconds)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default LeaderBoard;
