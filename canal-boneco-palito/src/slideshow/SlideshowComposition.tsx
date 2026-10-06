import {
  TransitionSeries,
  linearTiming,
  type TransitionPresentation,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { pageTurn } from "./PageTurn";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";

export type SlideshowTransition =
  | "fade"
  | "slide"
  | "wipe"
  | "flip"
  | "clockWipe"
  | "pageTurn"
  | "mix";

export type SlideshowProps = {
  /** Caminhos relativos à pasta public/ (ex.: "media/foto.jpg"). */
  images: string[];
  /**
   * Tempo em que cada imagem fica inteira na tela, sem contar as transições.
   * Para leitura de livro, é o tempo que a pessoa tem para ler a página.
   */
  secondsPerImage: number;
  /** Tempo de leitura individual por imagem (mesma ordem de `images`). Sobrepõe `secondsPerImage`. */
  durations?: number[];
  /** Duração da transição entre duas imagens. */
  transitionSeconds: number;
  /**
   * "pageTurn" vira a página do livro aberto (duas páginas lado a lado, lombada no
   * centro da imagem).
   */
  transitionType: SlideshowTransition;
  /**
   * Com "pageTurn", a primeira imagem é a capa (página única): ela entra na leitura
   * com fade em vez de virar página.
   */
  coverFirst: boolean;
  /** Som de virar página, tocado a cada "pageTurn". Caminho relativo a public/. */
  pageSound?: string;
  pageSoundVolume: number;
  /** "contain" mostra a imagem inteira (com fundo); "cover" preenche e corta. */
  fit: "contain" | "cover";
  /** Zoom lento em cada imagem (efeito Ken Burns). 0 desliga. */
  zoom: number;
  background: string;
  /** Música de fundo (repete em loop). Caminho relativo a public/. Opcional. */
  audio?: string;
  audioVolume: number;
  width: number;
  height: number;
};

export const slideshowDefaults: SlideshowProps = {
  images: [],
  secondsPerImage: 3,
  durations: undefined,
  transitionSeconds: 1,
  transitionType: "fade",
  coverFirst: true,
  pageSound: undefined,
  pageSoundVolume: 0.5,
  fit: "contain",
  zoom: 0.06,
  background: "#000000",
  audio: undefined,
  audioVolume: 1,
  width: 1920,
  height: 1080,
};

const FPS = 30;

const framesOf = (seconds: number) => Math.max(1, Math.round(seconds * FPS));

// Calcula a linha do tempo. Cada imagem fica inteira na tela pelo tempo pedido
// e o trecho de transição entra a mais, nos dois lados dela. A transição é
// limitada ao menor tempo de leitura, senão as cenas se sobrepõem por inteiro.
const resolveTimeline = (p: SlideshowProps) => {
  const n = p.images.length;
  const reads = p.images.map((_, i) => framesOf(p.durations?.[i] ?? p.secondsPerImage));
  const shortest = reads.length ? Math.min(...reads) : framesOf(p.secondsPerImage);
  const overlapFrames =
    n < 2 ? 0 : Math.min(Math.max(1, Math.round(p.transitionSeconds * FPS)), shortest);

  const sequences = reads.map(
    (read, i) => read + (i > 0 ? overlapFrames : 0) + (i < n - 1 ? overlapFrames : 0),
  );
  // Frame em que a transição entre a imagem i e a i+1 começa.
  const transitionStarts: number[] = [];
  let start = 0;
  for (let i = 0; i < n - 1; i++) {
    transitionStarts.push(start + sequences[i] - overlapFrames);
    start += sequences[i] - overlapFrames;
  }
  const total = sequences.reduce((a, b) => a + b, 0) - Math.max(0, n - 1) * overlapFrames;
  return { sequences, overlapFrames, transitionStarts, total: Math.max(1, total) };
};

export const slideshowDuration = (p: SlideshowProps) => resolveTimeline(p).total;

const MIX_ORDER: SlideshowTransition[] = ["fade", "slide", "wipe", "fade", "flip"];

const presentationFor = (
  kind: SlideshowTransition,
  index: number,
  size: { width: number; height: number },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): TransitionPresentation<any> => {
  const resolved = kind === "mix" ? MIX_ORDER[index % MIX_ORDER.length] : kind;
  switch (resolved) {
    case "slide":
      return slide({ direction: index % 2 === 0 ? "from-right" : "from-left" });
    case "wipe":
      return wipe({ direction: index % 2 === 0 ? "from-left" : "from-right" });
    case "flip":
      return flip();
    case "pageTurn":
      return pageTurn();
    case "clockWipe":
      return clockWipe(size);
    case "fade":
    default:
      return fade();
  }
};

const Slide: React.FC<{
  src: string;
  fit: "contain" | "cover";
  zoom: number;
  durationInFrames: number;
  index: number;
}> = ({ src, fit, zoom, durationInFrames, index }) => {
  const frame = useCurrentFrame();
  // Alterna zoom-in e zoom-out para o movimento não ficar sempre igual.
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = index % 2 === 0 ? 1 + zoom * progress : 1 + zoom * (1 - progress);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: fit,
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};

export const SlideshowVideo: React.FC<SlideshowProps> = (props) => {
  const { width, height, durationInFrames } = useVideoConfig();
  const { sequences, overlapFrames, transitionStarts } = resolveTimeline(props);

  // Música entra e sai devagar para não chamar atenção.
  const fadeIn = 2 * FPS;
  const fadeOut = 3 * FPS;
  const musicVolume = (f: number) =>
    props.audioVolume *
    interpolate(
      f,
      [0, fadeIn, durationInFrames - fadeOut, durationInFrames],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

  // Com capa, a primeira transição é um fade; só as demais viram página.
  const kindAt = (i: number): SlideshowTransition =>
    props.transitionType === "pageTurn" && props.coverFirst && i === 0
      ? "fade"
      : props.transitionType;

  return (
    <AbsoluteFill style={{ backgroundColor: props.background }}>
      {props.audio ? <Audio src={staticFile(props.audio)} loop volume={musicVolume} /> : null}
      {props.pageSound
        ? transitionStarts.map((from, i) =>
            props.transitionType === "pageTurn" ? (
              <Sequence key={`snd-${i}`} from={from + 3} durationInFrames={FPS * 2}>
                <Audio src={staticFile(props.pageSound!)} volume={() => props.pageSoundVolume} />
              </Sequence>
            ) : null,
          )
        : null}
      <TransitionSeries>
        {props.images.flatMap((src, i) => {
          const items = [
            <TransitionSeries.Sequence key={`s-${i}`} durationInFrames={sequences[i]}>
              <Slide
                src={src}
                fit={props.fit}
                zoom={props.zoom}
                durationInFrames={sequences[i]}
                index={i}
              />
            </TransitionSeries.Sequence>,
          ];
          if (i < props.images.length - 1) {
            items.push(
              <TransitionSeries.Transition
                key={`t-${i}`}
                presentation={presentationFor(kindAt(i), i, { width, height })}
                timing={linearTiming({ durationInFrames: overlapFrames })}
              />,
            );
          }
          return items;
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

const calculateMetadata: CalculateMetadataFunction<SlideshowProps> = ({ props }) => ({
  durationInFrames: slideshowDuration(props),
  width: props.width,
  height: props.height,
});

export const Slideshow = () => {
  return (
    <Composition
      id="Slideshow"
      component={SlideshowVideo}
      durationInFrames={slideshowDuration(slideshowDefaults)}
      fps={FPS}
      width={slideshowDefaults.width}
      height={slideshowDefaults.height}
      defaultProps={slideshowDefaults}
      calculateMetadata={calculateMetadata}
    />
  );
};

/** Teste: capa + folha de rosto + créditos de "O Filho do Grúfalo", lidos como livro. */
export const slideshowTestProps: SlideshowProps = {
  ...slideshowDefaults,
  images: [
    "media/slideshow-teste/01-capa.png",
    "media/slideshow-teste/02-folha-de-rosto.png",
    "media/slideshow-teste/03-creditos.png",
  ],
  // Capa rápida; folha de rosto e créditos têm mais texto para ler.
  durations: [4, 6, 8],
  transitionType: "pageTurn",
  transitionSeconds: 1.4,
  zoom: 0,
  background: "#1a1410",
  audio: "audio/slideshow/chopin-noturno-op9-n2.mp3",
  audioVolume: 0.55,
  pageSound: "audio/slideshow/virar-pagina.mp3",
  pageSoundVolume: 0.65,
};

export const SlideshowTest = () => {
  return (
    <Composition
      id="SlideshowTeste"
      component={SlideshowVideo}
      durationInFrames={slideshowDuration(slideshowTestProps)}
      fps={FPS}
      width={slideshowTestProps.width}
      height={slideshowTestProps.height}
      defaultProps={slideshowTestProps}
      calculateMetadata={calculateMetadata}
    />
  );
};
