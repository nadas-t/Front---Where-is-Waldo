import { useLayoutEffect, useRef } from "react";

import type { ApiCharacter } from "../services/api";

type CharacterMenuProps = {
  characters: ApiCharacter[];
  position: {
    x: number;
    y: number;
  };
  onClose: () => void;
  onSelect: (character: ApiCharacter) => void;
};

function CharacterMenu({
  characters,
  position,
  onClose,
  onSelect,
}: CharacterMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const menu = menuRef.current;
    const container = menu?.parentElement;

    if (!menu || !container) return;

    const gap = 12;
    const inset = 8;
    const opensLeft = position.x > container.clientWidth / 2;
    const opensAbove = position.y > container.clientHeight / 2;
    const preferredLeft = opensLeft
      ? position.x - menu.offsetWidth - gap
      : position.x + gap;
    const preferredTop = opensAbove
      ? position.y - menu.offsetHeight - gap
      : position.y + gap;

    menu.style.left = `${Math.min(
      Math.max(inset, preferredLeft),
      Math.max(inset, container.clientWidth - menu.offsetWidth - inset),
    )}px`;
    menu.style.top = `${Math.min(
      Math.max(inset, preferredTop),
      Math.max(inset, container.clientHeight - menu.offsetHeight - inset),
    )}px`;
    menu.style.visibility = "visible";
  }, [characters.length, position]);

  return (
    <div
      className="animate-toast absolute z-10 max-h-[calc(100%-1rem)] w-56 overflow-y-auto rounded-2xl border border-navy-900/10 bg-white/95 shadow-[0_18px_45px_rgba(13,27,53,0.25)] backdrop-blur-md"
      ref={menuRef}
      style={{
        left: position.x,
        top: position.y,
        visibility: "hidden",
      }}
    >
      <div className="flex items-center justify-between border-b border-navy-900/10 px-3 py-2.5">
        <span className="text-xs font-extrabold uppercase tracking-wider text-navy-700">
          Quem está aqui?
        </span>
        <button
          aria-label="Fechar menu"
          className="grid h-7 w-7 place-items-center rounded-full text-lg font-bold text-navy-700 transition hover:bg-waldo-100 hover:text-waldo-700"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
      </div>
      {characters.map((character) => (
        <button
          className="flex w-full items-center gap-3 border-b border-navy-900/5 px-3 py-2.5 text-left text-sm font-bold text-navy-900 transition last:border-0 hover:bg-waldo-50 hover:text-waldo-700"
          key={character.id}
          onClick={() => onSelect(character)}
          type="button"
        >
          <img
            alt=""
            className="h-10 w-10 rounded-xl border border-navy-900/10 object-cover"
            src={character.imageUrl}
          />
          <span>{character.name}</span>
        </button>
      ))}
    </div>
  );
}

export default CharacterMenu;
