import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import SiteHeader from "../components/SiteHeader";

const characters = [
  {
    name: "Waldo",
    imageUrl: "/characters/wally.png",
    description:
      "Um viajante incansável que explora lugares extraordinários com sua camisa listrada, gorro, óculos e bengala. Está sempre no centro das aventuras, mesmo quando se mistura à multidão.",
  },
  {
    name: "Wenda",
    imageUrl: "/characters/wenda.png",
    description:
      "A melhor amiga de Waldo, uma aventureira curiosa que acompanha muitas viagens e costuma registrar tudo com sua câmera fotográfica.",
  },
  {
    name: "Wizard Whitebeard",
    imageUrl: "/characters/wizard.png",
    description:
      "O sábio mago que coloca as aventuras em movimento com pergaminhos mágicos. Sua longa barba branca costuma ser uma pista importante nas ilustrações.",
  },
  {
    name: "Odlaw",
    imageUrl: "/characters/odlaw.png",
    description:
      "O eterno rival de Waldo, vestido com listras amarelas e pretas, óculos azulados e bigode. Até seu nome revela a rivalidade: Odlaw é Waldo ao contrário.",
  },
  {
    name: "Woof",
    imageUrl: "/characters/woof.png",
    description:
      "O fiel companheiro de quatro patas de Waldo. Tímido, costuma se esconder em cenas agitadas, deixando muitas vezes apenas o rabinho à mostra.",
  },
];

const names = [
  { countries: "Reino Unido e Brasil", flags: "🇬🇧 🇧🇷", name: "Wally" },
  { countries: "Estados Unidos e Canadá", flags: "🇺🇸 🇨🇦", name: "Waldo" },
  { countries: "França", flags: "🇫🇷", name: "Charlie" },
  { countries: "Alemanha", flags: "🇩🇪", name: "Walter" },
  { countries: "Noruega", flags: "🇳🇴", name: "Willy" },
  { countries: "Dinamarca", flags: "🇩🇰", name: "Holger" },
  { countries: "Itália", flags: "🇮🇹", name: "Ubaldo" },
  { countries: "Israel", flags: "🇮🇱", name: "Effi" },
];

function Home() {
  const [isWaldoToastVisible, setIsWaldoToastVisible] = useState(false);
  const [isWaldoToastFading, setIsWaldoToastFading] = useState(false);
  const [waldoToastPosition, setWaldoToastPosition] = useState({
    x: 0,
    y: 0,
    placement: "bottom" as "top" | "bottom",
  });
  const fadeTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  function openWaldoPopup(event: React.MouseEvent<HTMLButtonElement>) {
    if (fadeTimerRef.current) {
      window.clearTimeout(fadeTimerRef.current);
    }

    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }

    setIsWaldoToastVisible(true);
    setIsWaldoToastFading(false);
    setWaldoToastPosition({
      x: event.clientX,
      y: event.clientY,
      placement: event.clientY > window.innerHeight * 0.65 ? "top" : "bottom",
    });

    fadeTimerRef.current = window.setTimeout(() => {
      setIsWaldoToastFading(true);
    }, 700);

    hideTimerRef.current = window.setTimeout(() => {
      setIsWaldoToastVisible(false);
      setIsWaldoToastFading(false);
    }, 2300);
  }

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) {
        window.clearTimeout(fadeTimerRef.current);
      }

      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  return (
    <main className="app-shell text-navy-700">
      <SiteHeader />
      <section className="page-content mx-auto w-full max-w-7xl px-4 pb-16 pt-3 sm:px-6 sm:pt-8 lg:px-8">
        <div className="surface overflow-hidden rounded-[2rem]">
          <div className="brand-stripes h-2.5" />
          <div className="grid items-center gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-14 lg:py-16">
            <div>
              <p className="eyebrow">O clássico desafio de observação</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.045em] text-navy-900 sm:text-6xl lg:text-7xl">
                Um mundo inteiro.
                <span className="block text-waldo-600">
                  Um rosto escondido.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-navy-700/75 sm:text-lg">
                Explore cenas cheias de detalhes, encontre Waldo e seus amigos
                antes que o relógio leve a melhor.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  className="inline-flex items-center justify-center gap-3 rounded-xl bg-waldo-600 px-6 py-3.5 text-sm font-extrabold !text-white shadow-lg shadow-red-900/20 transition hover:-translate-y-0.5 hover:bg-waldo-700"
                  to="/levels"
                >
                  Escolher um cenário
                  <span aria-hidden="true" className="text-lg">
                    →
                  </span>
                </Link>
                <span className="text-sm font-semibold text-navy-700/60">
                  8 cenários para explorar
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xs lg:max-w-none">
              <div className="absolute -inset-4 rotate-3 rounded-[2rem] bg-navy-900" />
              <div className="brand-stripes absolute -inset-2 -rotate-2 rounded-[1.7rem]" />
              <button
                aria-label="Waldo da capa"
                className="relative block w-full rounded-3xl text-left outline-none focus-visible:ring-2 focus-visible:ring-waldo-500/70"
                onClick={openWaldoPopup}
                type="button"
              >
                <img
                  alt="Wally acenando"
                  className="aspect-[4/3] w-full rounded-3xl bg-white object-cover shadow-2xl"
                  src="/home/home_wally.png"
                />
              </button>
              <span className="absolute -bottom-4 -left-4 rounded-xl bg-white px-4 py-2 text-sm font-black text-navy-900 shadow-xl">
                Pronto para procurar?
              </span>
            </div>
          </div>

          <div className="bg-navy-50/70 px-6 py-10 sm:px-10 lg:px-14">
            <section>
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
                <div>
                  <p className="eyebrow">A história por trás das listras</p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-navy-900">
                    Bem-vindo ao universo de Waldo
                  </h2>
                  <div className="mt-5 space-y-4 text-sm leading-7 text-navy-700/80 sm:text-base">
                    <p>
                      Desde sua estreia em{" "}
                      <strong className="font-black text-waldo-800">
                        25 de junho de 1987
                      </strong>
                      , <em>Where&apos;s Wally?</em>, conhecido como{" "}
                      <em>Where&apos;s Waldo?</em> na América do Norte, desafia
                      leitores de todas as idades a encontrar um personagem
                      escondido em enormes cenas repletas de detalhes e centenas
                      de personagens. A série foi criada pelo ilustrador
                      britânico Martin Handford e rapidamente se tornou um dos
                      livros de quebra-cabeças visuais mais famosos do mundo.
                    </p>

                    <p>
                      Ao longo de mais de três décadas, a franquia já vendeu{" "}
                      <strong className="font-black text-waldo-800">
                        mais de 70 milhões de exemplares
                      </strong>
                      , foi traduzida para{" "}
                      <strong className="font-black text-waldo-800">
                        mais de 25 idiomas
                      </strong>{" "}
                      e publicada em{" "}
                      <strong className="font-black text-waldo-800">
                        mais de 50 países
                      </strong>
                      , tornando Wally um verdadeiro ícone da cultura pop.
                    </p>

                    <p>
                      O que torna os livros tão especiais é o cuidado extremo
                      colocado em cada ilustração. Handford desenha tudo
                      manualmente e leva{" "}
                      <strong className="font-black text-waldo-800">
                        até oito semanas para finalizar uma única cena de duas
                        páginas
                      </strong>
                      , que pode conter entre{" "}
                      <strong className="font-black text-waldo-800">
                        300 e mais de 500 personagens
                      </strong>
                      , além de inúmeros detalhes e pequenas histórias
                      acontecendo simultaneamente. Curiosamente,{" "}
                      <strong className="font-black text-waldo-800">
                        Wally costuma ser o último personagem desenhado
                      </strong>
                      , sendo colocado apenas quando toda a cena está pronta
                      para garantir que seu esconderijo seja realmente
                      desafiador.
                    </p>

                    <p>
                      Com o passar dos anos, os livros ficaram cada vez mais
                      difíceis. Estudos mostram que o próprio Wally foi ficando
                      progressivamente menor nas páginas, aumentando o desafio
                      de encontrá-lo em meio às multidões.
                    </p>

                    <div className="mt-6 rounded-2xl border border-navy-900/10 bg-white p-5">
                      <h3 className="text-lg font-black text-navy-900">
                        Sobre este projeto
                      </h3>
                      <p className="mt-2">
                        Este site é uma homenagem ao clássico criado por Martin
                        Handford. Aqui você poderá colocar suas habilidades de
                        observação à prova procurando Wally em diferentes
                        cenários, competindo contra o tempo e tentando
                        conquistar as melhores pontuações.
                      </p>
                      <p className="mt-2 font-bold text-navy-900">
                        Boa sorte... e lembre-se: ele sempre está na página.
                        Você só precisa encontrá-lo.
                      </p>
                    </div>
                  </div>
                </div>

                <figure>
                  <img
                    alt="Martin Handford, criador de Where's Wally"
                    className="w-full rounded-3xl border-4 border-white object-cover shadow-xl"
                    src="/home/Martin_Handford.webp"
                  />
                  <figcaption className="mt-2 text-xs font-semibold text-waldo-700/60">
                    Martin Handford, criador de Where&apos;s Wally.
                  </figcaption>
                </figure>
              </div>
            </section>

            <section className="mt-12 border-t border-navy-900/10 pt-10">
              <p className="eyebrow">Personagens</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-navy-900">
                Conheça quem está escondido
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {characters.map((character) =>
                  character.name === "Waldo" ? (
                    <button
                      className="flex w-full items-start gap-4 rounded-2xl border border-navy-900/10 bg-white p-4 text-left shadow-sm outline-none transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-waldo-500/70"
                      key={character.name}
                      onClick={openWaldoPopup}
                      type="button"
                    >
                      <img
                        alt={character.name}
                        className="h-16 w-16 shrink-0 rounded-2xl border-2 border-waldo-100 object-cover"
                        src={character.imageUrl}
                      />
                      <div>
                        <h2 className="text-base font-black text-waldo-800">
                          {character.name}
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-waldo-700/80">
                          {character.description}
                        </p>
                      </div>
                    </button>
                  ) : (
                    <div
                      className="flex items-start gap-4 rounded-2xl border border-navy-900/10 bg-white p-4 shadow-sm"
                      key={character.name}
                    >
                      <img
                        alt={character.name}
                        className="h-16 w-16 shrink-0 rounded-2xl border-2 border-waldo-100 object-cover"
                        src={character.imageUrl}
                      />
                      <div>
                        <h2 className="text-base font-black text-waldo-800">
                          {character.name}
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-waldo-700/80">
                          {character.description}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </section>

            <section className="mt-12 border-t border-navy-900/10 pt-10">
              <h2 className="text-3xl font-black text-navy-900">Você sabia?</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-waldo-700/80 sm:text-base">
                <p>
                  Embora muita gente o conheça como{" "}
                  <strong className="font-black text-waldo-800">Waldo</strong>,
                  esse não é seu nome em todos os lugares do mundo. Conforme a
                  série foi sendo publicada internacionalmente, os editores
                  adaptaram o nome do personagem para soar mais natural em cada
                  idioma.
                </p>

                <div>
                  <p className="font-bold text-waldo-800">Alguns exemplos:</p>
                  <ul className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                    {names.map((localizedName) => (
                      <li
                        className="flex items-center gap-3 rounded-xl border border-navy-900/10 bg-white px-3 py-2 shadow-sm"
                        key={localizedName.countries}
                      >
                        <span className="text-xl" aria-hidden="true">
                          {localizedName.flags}
                        </span>
                        <span>
                          <span className="font-semibold text-waldo-800">
                            {localizedName.name}
                          </span>{" "}
                          <span className="text-waldo-700/65">
                            — {localizedName.countries}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p>
                  Independentemente do nome, trata-se do mesmo personagem: o
                  aventureiro de camisa listrada vermelha e branca criado por
                  Martin Handford em 1987. Então, se você encontrar referências
                  a <em>Where&apos;s Wally?</em> ou <em>Where&apos;s Waldo?</em>
                  , saiba que ambos são exatamente o mesmo jogo de encontrar o
                  famoso viajante escondido.
                </p>
              </div>
            </section>

            <section className="mt-12 border-t border-navy-900/10 pt-10">
              <p className="eyebrow">Curiosidades</p>

              <div className="mt-4 space-y-6">
                <a
                  className="inline-flex text-sm font-bold text-navy-900 underline decoration-waldo-500/40 underline-offset-4 transition hover:text-waldo-600"
                  href="https://www.randalolson.com/2015/02/03/heres-waldo-computing-the-optimal-search-strategy-for-finding-waldo/"
                  rel="noreferrer"
                  target="_blank"
                >
                  Estratégia para encontrar Waldo
                </a>

                <div>
                  <p className="text-sm font-semibold text-waldo-700/80">
                    Vídeo de curiosidade
                  </p>
                  <div className="mt-3 aspect-video w-full max-w-2xl overflow-hidden rounded-2xl border border-black/10 bg-black shadow-lg">
                    <iframe
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="h-full w-full"
                      src="https://www.youtube.com/embed/_Kpfe1k6CuM"
                      title="Vídeo de curiosidade sobre Where is Waldo"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      {isWaldoToastVisible && (
        <div
          className={`pointer-events-none fixed z-50 max-w-sm rounded-2xl border border-white/40 bg-white p-4 text-navy-900 shadow-2xl transition-[opacity,transform] duration-700 ${
            isWaldoToastFading ? "opacity-0" : "opacity-100"
          }`}
          style={{
            left: `${waldoToastPosition.x}px`,
            top:
              waldoToastPosition.placement === "top"
                ? `${Math.max(16, waldoToastPosition.y - 16)}px`
                : `${Math.min(window.innerHeight - 16, waldoToastPosition.y + 16)}px`,
            transform:
              waldoToastPosition.placement === "top"
                ? "translate(-50%, -100%)"
                : "translate(-50%, 0)",
          }}
        >
          <p className="text-sm font-black leading-6">
            Ei! esse não valeu tava muito fácil.
          </p>
        </div>
      )}
    </main>
  );
}

export default Home;
