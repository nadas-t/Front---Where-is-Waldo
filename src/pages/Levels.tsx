import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import LevelCard from "../components/LevelCard";
import SiteHeader from "../components/SiteHeader";
import { listMaps, type ApiMap } from "../services/api";

function Levels() {
  const [maps, setMaps] = useState<ApiMap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    queueMicrotask(() => {
      if (isCurrent) {
        setIsLoading(true);
        setErrorMessage("");
      }
    });

    listMaps()
      .then((mapsData) => {
        if (isCurrent) {
          const difficultyOrder: Record<string, number> = {
            easy: 0,
            medium: 1,
            hard: 2,
          };

          const sorted = mapsData.slice().sort((a, b) => {
            const da = difficultyOrder[a.difficulty] ?? 99;
            const db = difficultyOrder[b.difficulty] ?? 99;

            if (da !== db) return da - db;
            return a.name.localeCompare(b.name);
          });

          setMaps(sorted);
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os níveis.",
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
  }, []);

  return (
    <main className="app-shell text-navy-700">
      <SiteHeader />
      <div className="page-content mx-auto w-full max-w-7xl px-4 pb-16 pt-5 sm:px-6 sm:pt-9 lg:px-8">
        <section className="max-w-3xl">
          <p className="eyebrow">Escolha sua próxima busca</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.035em] text-navy-900 sm:text-5xl">
            O mundo está cheio de esconderijos.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-navy-700/75 sm:text-lg">
            Cada cenário tem seu próprio ritmo e nível de desafio. Observe os
            detalhes, encontre todos os personagens e dispute o melhor tempo.
          </p>
        </section>

        {isLoading && (
          <div
            aria-label="Carregando níveis"
            className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div
                className="overflow-hidden rounded-3xl border border-navy-900/10 bg-white p-5"
                key={item}
              >
                <div className="skeleton -mx-5 -mt-5 h-48" />
                <div className="skeleton mt-5 h-6 w-2/3 rounded-lg" />
                <div className="skeleton mt-4 h-14 rounded-lg" />
                <div className="skeleton mt-5 h-11 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {errorMessage && (
          <div className="surface mt-10 max-w-2xl rounded-3xl border-red-200 p-6">
            <p className="text-lg font-black text-red-800">
              Os níveis não chegaram até aqui.
            </p>
            <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
            <p className="mt-1 text-sm text-navy-700/70">
              Verifique sua conexão e tente recarregar a página.
            </p>
          </div>
        )}

        {!isLoading && !errorMessage && maps.length === 0 && (
          <div className="surface mt-10 rounded-3xl p-10 text-center">
            <p className="text-lg font-black text-navy-900">
              Nenhum cenário disponível.
            </p>
            <p className="mt-2 text-sm text-navy-700/70">
              Novos esconderijos aparecerão aqui quando estiverem prontos.
            </p>
          </div>
        )}

        {!isLoading && !errorMessage && maps.length > 0 && (
          <div className="mt-10 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {maps.map((level) => (
              <LevelCard key={level.id} level={level} />
            ))}
          </div>
        )}

        <div className="mt-12 border-t border-navy-900/10 pt-6">
          <Link
            className="inline-flex items-center gap-2 text-sm font-bold text-navy-700 transition hover:text-waldo-600"
            to="/"
          >
            <span aria-hidden="true">←</span>
            Voltar para o início
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Levels;
