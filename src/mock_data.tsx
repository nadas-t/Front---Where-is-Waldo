export type CharacterPosition = {
  id: number;
  name: string;
  path_img: string;
  posicao_x: number; // 0 a 1
  posicao_y: number; // 0 a 1
  raio: number;
};

export type Map = {
  map_id: number;
  map_name: string;
  map_path: string;
  map_descr: string;
  characters: CharacterPosition[];
};

export const maps: Map[] = [
  {
    map_id: 1,
    map_name: "Praia Caótica",
    map_path: "/images/beach.png",
    map_descr: "Uma praia cheia de pessoas e objetos espalhados.",
    characters: [
      {
        id: 1,
        name: "Waldo",
        path_img: "/characters/wally.png",
        posicao_x: 0.527,
        posicao_y: 0.503,
        raio: 0.03,
      },
      {
        id: 2,
        name: "Wenda",
        path_img: "/characters/wenda.png",
        posicao_x: 0,
        posicao_y: 0,
        raio: 0.03,
      },
      {
        id: 3,
        name: "Wizard Whitebeard",
        path_img: "/characters/wizard.png",
        posicao_x: 0.611,
        posicao_y: 0.519,
        raio: 0.04,
      },
      {
        id: 4,
        name: "Odlaw",
        path_img: "/characters/odlaw.png",
        posicao_x: 0.28,
        posicao_y: 0.501,
        raio: 0.03,
      },
    ],
  },

  {
    map_id: 2,
    map_name: "Batalha Lotada",
    map_path: "/images/brawl.webp",
    map_descr: "Uma arena cheia de movimento, personagens e objetos.",
    characters: [
      {
        id: 1,
        name: "Waldo",
        path_img: "/characters/wally.png",
        posicao_x: 0.15,
        posicao_y: 0.78,
        raio: 0.03,
      },
      {
        id: 2,
        name: "Wenda",
        path_img: "/characters/wenda.png",
        posicao_x: 0.6,
        posicao_y: 0.2,
        raio: 0.03,
      },
      {
        id: 3,
        name: "Wizard Whitebeard",
        path_img: "/characters/wizard.png",
        posicao_x: 0.8,
        posicao_y: 0.55,
        raio: 0.04,
      },
      {
        id: 4,
        name: "Odlaw",
        path_img: "/characters/odlaw.png",
        posicao_x: 0.4,
        posicao_y: 0.65,
        raio: 0.03,
      },
    ],
  },
];
