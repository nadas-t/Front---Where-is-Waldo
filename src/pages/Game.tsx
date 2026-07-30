import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import CharacterMenu from "../components/CharacterMenu";
import CharacterRoster from "../components/CharacterRoster";
import LeaderBoard from "../components/LeaderBoard";
import SiteHeader from "../components/SiteHeader";
import Timer from "../components/Timer";
import {
  checkGuess,
  createScore,
  createSession,
  getMap,
  type ApiCharacter,
  type ApiMap,
  type ApiSession,
} from "../services/api";
import { getElapsedSeconds } from "../utils/time";

type ClickPosition = {
  x: number;
  y: number;
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

const DEFAULT_PLAYER_NAME = "Anonimo";

function Game() {
  const { mapId } = useParams();
  const [selectedMap, setSelectedMap] = useState<ApiMap | null>(null);
  const [session, setSession] = useState<ApiSession | null>(null);
  const [clickPosition, setClickPosition] = useState<ClickPosition | null>(
    null,
  );
  const [menuPosition, setMenuPosition] = useState<ClickPosition | null>(null);
  const [foundCharacters, setFoundCharacters] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isGuessing, setIsGuessing] = useState(false);
  const [playerName, setPlayerName] = useState(DEFAULT_PLAYER_NAME);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [scoreDismissed, setScoreDismissed] = useState(false);
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [scoreRefreshKey, setScoreRefreshKey] = useState(0);
  const [scoreMessage, setScoreMessage] = useState("");

  useEffect(() => {
    if (!mapId) return;

    let isCurrent = true;

    queueMicrotask(() => {
      if (isCurrent) {
        setIsLoading(true);
        setErrorMessage("");
        setScoreMessage("");
        setSelectedMap(null);
        setSession(null);
        setFoundCharacters([]);
        setIsGameStarted(false);
        setIsStartingSession(false);
        setPlayerName(DEFAULT_PLAYER_NAME);
        setScoreSubmitted(false);
        setScoreDismissed(false);
        setIsSubmittingScore(false);
      }
    });

    getMap(mapId)
      .then((mapData) => {
        if (isCurrent) {
          setSelectedMap(mapData);
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Não foi possível iniciar o jogo.",
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
  }, [mapId]);

  if (!mapId) {
    return <Navigate to="/levels" replace />;
  }

  const charactersToFind =
    selectedMap?.characters.filter(
      (character) => !foundCharacters.includes(character.id),
    ) ?? [];

  const isComplete = Boolean(session?.completedAt);
  const showScoreDialog = isComplete && !scoreSubmitted && !scoreDismissed;
  const showStartCover = Boolean(selectedMap && !isGameStarted);
  const difficulty = selectedMap
    ? difficultyTags[selectedMap.difficulty] ?? {
        label: selectedMap.difficulty,
        className: "border-gray-200 bg-gray-100 text-gray-800",
      }
    : null;

  async function startGame() {
    if (!selectedMap || isStartingSession) return;

    setIsStartingSession(true);
    setErrorMessage("");

    try {
      const sessionData = await createSession(selectedMap.id);

      setSession(sessionData);
      setFoundCharacters(sessionData.foundCharacterIds);
      setIsGameStarted(true);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível iniciar a partida.",
      );
    } finally {
      setIsStartingSession(false);
    }
  }

  async function restartGame() {
    if (!selectedMap || isStartingSession) return;

    setIsStartingSession(true);
    setErrorMessage("");
    setScoreMessage("");
    setScoreSubmitted(false);
    setScoreDismissed(false);
    setIsSubmittingScore(false);
    setPlayerName(DEFAULT_PLAYER_NAME);
    closeCharacterMenu();

    try {
      const sessionData = await createSession(selectedMap.id);

      setSession(sessionData);
      setFoundCharacters(sessionData.foundCharacterIds);
      setIsGameStarted(true);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível reiniciar a partida.",
      );
    } finally {
      setIsStartingSession(false);
    }
  }

  function handleMapClick(e: MouseEvent<HTMLImageElement>) {
    if (!selectedMap || !isGameStarted || isComplete || isGuessing) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const xPercent = (e.clientX - rect.left) / rect.width;
    const yPercent = (e.clientY - rect.top) / rect.height;

    setClickPosition({ x: xPercent, y: yPercent });
    setMenuPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setErrorMessage("");

  }

  function closeCharacterMenu() {
    setClickPosition(null);
    setMenuPosition(null);
  }

  async function handleCharacterSelect(character: ApiCharacter) {
    if (!clickPosition || !session || !selectedMap) return;

    setIsGuessing(true);
    setErrorMessage("");

    try {
      const result = await checkGuess({
        mapId: selectedMap.id,
        sessionId: session.id,
        characterId: character.id,
        x: clickPosition.x,
        y: clickPosition.y,
      });

      setSession(result.session);
      setFoundCharacters(result.session.foundCharacterIds);

      if (!result.found) {
        setErrorMessage(`Não é ${character.name} aqui!`);
      }
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível validar a resposta.",
      );
    } finally {
      setIsGuessing(false);
      closeCharacterMenu();
    }
  }

  async function handleScoreSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!session || isSubmittingScore) return;

    const nameForScore = playerName.trim() || DEFAULT_PLAYER_NAME;

    setIsSubmittingScore(true);
    setScoreMessage("");
    setErrorMessage("");

    try {
      await createScore({
        sessionId: session.id,
        playerName: nameForScore,
      });

      setScoreSubmitted(true);
      setScoreDismissed(false);
      setPlayerName(nameForScore);
      setScoreRefreshKey((currentKey) => currentKey + 1);
      setScoreMessage("Pontuação enviada.");
    } catch (error: unknown) {
      setScoreMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a pontuação.",
      );
    } finally {
      setIsSubmittingScore(false);
    }
  }

  function dismissScoreDialog() {
    setScoreDismissed(true);
    setScoreMessage("");
  }

  return (
    <main className="app-shell text-navy-700">
      <SiteHeader compact />

      <div className="page-content mx-auto w-full max-w-[96rem] px-4 pb-14 sm:px-6 lg:px-8">
        <Link
          className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-navy-700 transition hover:text-waldo-600"
          to="/levels"
        >
          <span aria-hidden="true">←</span>
          Todos os cenários
        </Link>

        {isLoading && (
          <div className="surface grid min-h-[60vh] place-items-center rounded-3xl p-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-waldo-100 border-t-waldo-600" />
              <p className="mt-4 font-bold text-navy-900">
                Preparando o cenário...
              </p>
              <p className="mt-1 text-sm text-navy-700/65">
                Espalhando pistas e escondendo personagens.
              </p>
            </div>
          </div>
        )}

        {!isLoading && selectedMap && (
          <>
            <section className="surface overflow-hidden rounded-3xl">
              <div className="brand-stripes h-2" />
              <div className="grid lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_21rem]">
                <div className="min-w-0 p-3 sm:p-5 lg:p-6">
                  <div className="mb-4 flex flex-wrap items-end justify-between gap-3 px-1">
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h1 className="text-2xl font-black tracking-tight text-navy-900 sm:text-3xl">
                          {selectedMap.name}
                        </h1>
                        {difficulty && (
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-wider ${difficulty.className}`}
                          >
                            {difficulty.label}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 hidden text-sm text-navy-700/65 sm:block">
                        Clique na imagem quando encontrar alguém.
                      </p>
                    </div>
                    {session && (
                      <Timer
                        completedAt={session.completedAt}
                        startedAt={session.startedAt}
                      />
                    )}
                  </div>

                  <div className="relative mx-auto w-fit max-w-full overflow-hidden rounded-2xl border border-navy-900/15 bg-navy-900 shadow-[0_18px_45px_rgba(13,27,53,0.18)]">
                    <img
                      alt={selectedMap.name}
                      className={`block h-auto max-h-[76vh] max-w-full object-contain ${
                        isGameStarted && !isComplete
                          ? "cursor-crosshair"
                          : "cursor-default"
                      }`}
                      onClick={handleMapClick}
                      src={selectedMap.imageUrl}
                    />

                    {clickPosition && menuPosition && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute z-[5] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-waldo-500/20 shadow-[0_0_0_3px_rgba(201,39,44,0.9)]"
                        style={{
                          left: `${clickPosition.x * 100}%`,
                          top: `${clickPosition.y * 100}%`,
                        }}
                      />
                    )}

                    {menuPosition && charactersToFind.length > 0 && (
                      <CharacterMenu
                        characters={charactersToFind}
                        onClose={closeCharacterMenu}
                        onSelect={handleCharacterSelect}
                        position={menuPosition}
                      />
                    )}

                    {showStartCover && (
                      <div className="absolute inset-0 z-20 grid place-items-center bg-navy-900/65 p-4 backdrop-blur-[3px]">
                        <div className="max-w-sm rounded-3xl border border-white/20 bg-white/95 p-5 text-center shadow-2xl sm:p-7">
                          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-waldo-100 text-2xl">
                            🔎
                          </span>
                          <h2 className="mt-3 text-xl font-black text-navy-900">
                            Olhos atentos?
                          </h2>
                          <p className="mt-2 text-sm leading-6 text-navy-700/70">
                            Encontre {selectedMap.characters.length} personagens.
                            O cronômetro começa ao iniciar.
                          </p>
                          <button
                            className="mt-5 w-full rounded-xl bg-waldo-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-red-900/20 transition hover:bg-waldo-700 disabled:cursor-not-allowed disabled:opacity-70"
                            disabled={isStartingSession}
                            onClick={startGame}
                            type="button"
                          >
                            {isStartingSession
                              ? "Preparando..."
                              : "Iniciar partida"}
                          </button>
                        </div>
                      </div>
                    )}

                    {isComplete && (
                      <div className="absolute inset-0 z-20 grid place-items-center bg-navy-900/55 p-4 backdrop-blur-[2px]">
                        <button
                          className="rounded-xl border border-white/70 bg-white px-6 py-3 text-sm font-black text-navy-900 shadow-xl transition hover:-translate-y-0.5 hover:bg-waldo-50 disabled:cursor-not-allowed disabled:opacity-70"
                          disabled={isStartingSession}
                          onClick={restartGame}
                          type="button"
                        >
                          {isStartingSession
                            ? "Reiniciando..."
                            : "Jogar novamente"}
                        </button>
                      </div>
                    )}

                    {(errorMessage || isGuessing) && isGameStarted && (
                      <div
                        aria-live="polite"
                        className={`animate-toast absolute left-1/2 top-3 z-30 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-xl border px-4 py-3 text-center text-sm font-bold shadow-xl ${
                          isGuessing
                            ? "border-navy-100 bg-white text-navy-900"
                            : "border-red-200 bg-red-50 text-red-800"
                        }`}
                      >
                        {isGuessing ? "Conferindo sua escolha..." : errorMessage}
                      </div>
                    )}
                  </div>
                </div>

                <aside className="border-t border-navy-900/10 bg-navy-50/70 p-5 lg:border-l lg:border-t-0 lg:p-6">
                  <p className="eyebrow">Sua missão</p>
                  <p className="mt-2 text-sm leading-6 text-navy-700/70">
                    {selectedMap.description}
                  </p>

                  <div className="mt-5 rounded-2xl border border-navy-900/10 bg-white p-4 shadow-sm">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-navy-500/70">
                          Progresso
                        </p>
                        <p className="mt-1 text-lg font-black text-navy-900">
                          {foundCharacters.length} de{" "}
                          {selectedMap.characters.length}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-navy-700">
                        {charactersToFind.length === 0
                          ? "Completo"
                          : `${charactersToFind.length} ${
                              charactersToFind.length === 1
                                ? "restante"
                                : "restantes"
                            }`}
                      </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-navy-100">
                      <div
                        className="h-full rounded-full bg-waldo-500 transition-all duration-500"
                        style={{
                          width: `${
                            (foundCharacters.length /
                              selectedMap.characters.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <CharacterRoster
                      characters={selectedMap.characters}
                      foundCharacterIds={foundCharacters}
                    />
                  </div>

                  {isComplete && (
                    <div className="animate-toast mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
                      Missão cumprida! Todos foram encontrados.
                    </div>
                  )}

                  {scoreMessage && (
                    <p className="animate-toast mt-4 rounded-xl bg-white p-3 text-sm font-bold text-navy-800 shadow-sm">
                      {scoreMessage}
                    </p>
                  )}
                </aside>
              </div>
            </section>

            <LeaderBoard
              mapId={selectedMap.id}
              refreshKey={scoreRefreshKey}
            />
          </>
        )}

        {!isLoading && !selectedMap && (
          <div className="surface rounded-3xl border-red-200 p-8 text-center">
            <span className="text-3xl">🧭</span>
            <h1 className="mt-3 text-2xl font-black text-navy-900">
              Cenário não encontrado
            </h1>
            <p className="mt-2 text-sm text-red-700">
              {errorMessage || "Este nível não está disponível."}
            </p>
            <Link
              className="mt-5 inline-flex rounded-xl bg-navy-900 px-5 py-3 text-sm font-bold text-white"
              to="/levels"
            >
              Ver outros cenários
            </Link>
          </div>
        )}
      </div>

      {showScoreDialog && session && (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-navy-900/70 px-4 py-6 backdrop-blur-sm"
          onClick={dismissScoreDialog}
          role="dialog"
        >
          <form
            className="animate-toast relative w-full max-w-md overflow-hidden rounded-3xl bg-white text-navy-900 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            onSubmit={handleScoreSubmit}
          >
            <div className="brand-stripes h-2.5" />
            <button
              aria-label="Fechar placar"
              className="absolute right-4 top-5 grid h-9 w-9 place-items-center rounded-full text-xl font-bold text-navy-700 transition hover:bg-waldo-100"
              onClick={dismissScoreDialog}
              type="button"
            >
              ×
            </button>

            <div className="p-6 sm:p-8">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-3xl">
                ✓
              </span>
              <p className="eyebrow mt-5">Missão cumprida</p>
              <h2 className="mt-2 pr-10 text-3xl font-black tracking-tight text-navy-900">
                Você encontrou todos!
              </h2>
              <p className="mt-3 text-sm leading-6 text-navy-700/75">
                Seu tempo foi de{" "}
                <strong className="font-mono text-base text-navy-900">
                  {getElapsedSeconds(session.startedAt, session.completedAt)}s
                </strong>
                . Registre seu nome para entrar no ranking.
              </p>

              <label className="mt-6 block">
                <span className="text-sm font-bold text-navy-900">
                  Como devemos chamar você?
                </span>
                <input
                  autoFocus
                  className="mt-2 w-full rounded-xl border border-navy-900/15 bg-navy-50/60 px-4 py-3 text-sm font-semibold text-navy-900 outline-none transition focus:border-waldo-500 focus:bg-white"
                  maxLength={40}
                  onChange={(event) => setPlayerName(event.target.value)}
                  placeholder="Seu nome"
                  type="text"
                  value={playerName}
                />
              </label>

              {scoreMessage && (
                <p className="mt-3 text-sm font-semibold text-red-700">
                  {scoreMessage}
                </p>
              )}

              <button
                className="mt-5 w-full rounded-xl bg-waldo-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-red-900/15 transition hover:bg-waldo-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmittingScore}
                type="submit"
              >
                {isSubmittingScore ? "Salvando tempo..." : "Entrar no ranking"}
              </button>
              <button
                className="mt-2 w-full rounded-xl px-5 py-2.5 text-sm font-bold text-navy-700 transition hover:bg-navy-50"
                onClick={dismissScoreDialog}
                type="button"
              >
                Agora não
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default Game;
