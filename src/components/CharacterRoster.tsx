import type { ApiCharacter } from "../services/api";

type CharacterRosterProps = {
  characters: ApiCharacter[];
  foundCharacterIds: string[];
};

function CharacterRoster({
  characters,
  foundCharacterIds,
}: CharacterRosterProps) {
  return (
    <section aria-label="Personagens da missão">
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
        {characters.map((character) => {
          const wasFound = foundCharacterIds.includes(character.id);

          return (
            <div
              className={`relative flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl border px-3 py-2.5 transition duration-300 ${
                wasFound
                  ? "border-emerald-200 bg-emerald-50/80"
                  : "border-navy-900/10 bg-white shadow-sm"
              }`}
              key={character.id}
            >
              <span
                aria-hidden="true"
                className={`absolute inset-y-0 left-0 w-1 ${
                  wasFound ? "bg-emerald-500" : "bg-waldo-500"
                }`}
              />
              <img
                alt={character.name}
                className={`h-11 w-11 shrink-0 rounded-xl border-2 object-cover transition duration-300 ${
                  wasFound
                    ? "border-emerald-200 grayscale opacity-60"
                    : "border-waldo-100"
                }`}
                src={character.imageUrl}
              />
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm font-bold ${
                    wasFound
                      ? "text-navy-700/55 line-through"
                      : "text-navy-900"
                  }`}
                >
                  {character.name}
                </p>
                <p
                  className={`mt-0.5 text-[0.7rem] font-extrabold uppercase tracking-wider ${
                    wasFound ? "text-emerald-700" : "text-navy-500/70"
                  }`}
                >
                  {wasFound ? "Encontrado" : "Ainda escondido"}
                </p>
              </div>
              {wasFound && (
                <span
                  aria-hidden="true"
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-500 text-xs font-black text-white"
                >
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CharacterRoster;
