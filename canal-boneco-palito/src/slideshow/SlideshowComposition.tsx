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
import {
  AbsoluteFill,
  Audio,
  Composition,
  Img,
  interpolate,
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
  | "mix";

export type SlideshowProps = {
  /** Caminhos relativos à pasta public/ (ex.: "media/foto.jpg"). */
  images: string[];
  /** Quanto tempo cada imagem fica visível, já contando a transição. */
  secondsPerImage: number;
  /** Duração da transição entre duas imagens. */
  transitionSeconds: number;
  transitionType: SlideshowTransition;
  /** "contain" mostra a imagem inteira (com fundo); "cover" preenche e corta. */
  fit: "contain" | "cover";
  /** Zoom lento em cada imagem (efeito Ken Burns). 0 desliga. */
  zoom: number;
  background: string;
  /** Caminho relativo a public/. Opcional. */
  audio?: string;
  audioVolume: number;
  width: number;
  height: number;
};

export const slideshowDefaults: SlideshowProps = {
  images: [],
  secondsPerImage: 3,
  transitionSeconds: 1,
  transitionType: "fade",
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

// A transição precisa ser mais curta que a imagem, senão as cenas se sobrepõem
// por inteiro e a duração fica negativa.
const resolveFrames = (p: SlideshowProps) => {
  const perImage = framesOf(p.secondsPerImage);
  const maxTransition = Math.max(1, Math.floor(perImage / 2));
  const overlapFrames =
    p.images.length < 2
      ? 0
      : Math.min(Math.max(1, Math.round(p.transitionSeconds * FPS)), maxTransition);
  return { perImage, overlapFrames };
};

export const slideshowDuration = (p: SlideshowProps) => {
  const { perImage, overlapFrames } = resolveFrames(p);
  const n = Math.max(1, p.images.length);
  return n * perImage - (n - 1) * overlapFrames;
};

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
  const { width, height } = useVideoConfig();
  const { perImage, overlapFrames } = resolveFrames(props);

  return (
    <AbsoluteFill style={{ backgroundColor: props.background }}>
      {props.audio ? (
        <Audio src={staticFile(props.audio)} volume={() => props.audioVolume} />
      ) : null}
      <TransitionSeries>
        {props.images.flatMap((src, i) => {
          const items = [
            <TransitionSeries.Sequence key={`s-${i}`} durationInFrames={perImage}>
              <Slide
                src={src}
                fit={props.fit}
                zoom={props.zoom}
                durationInFrames={perImage}
                index={i}
              />
            </TransitionSeries.Sequence>,
          ];
          if (i < props.images.length - 1) {
            items.push(
              <TransitionSeries.Transition
                key={`t-${i}`}
                presentation={presentationFor(props.transitionType, i, { width, height })}
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

/** Teste: capa + folha de rosto + créditos de "O Filho do Grúfalo". */
export const slideshowTestProps: SlideshowProps = {
  ...slideshowDefaults,
  images: [
    "media/slideshow-teste/01-capa.png",
    "media/slideshow-teste/02-folha-de-rosto.png",
    "media/slideshow-teste/03-creditos.png",
  ],
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
