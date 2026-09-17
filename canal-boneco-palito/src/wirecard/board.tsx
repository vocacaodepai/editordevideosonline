import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors } from "../theme";
import { bodyFont, headlineFont, monoFont } from "../fonts";
import { LINES } from "./timings";

/**
 * Motor de quadros ("boards").
 *
 * A diferença para a versão anterior: o quadro NÃO troca a cada frase. Ele
 * fica em pé e cresce. Cada frase da narração acrescenta uma camada ao mesmo
 * diagrama, no frame exato em que a voz começa aquela frase. No fim do bloco
 * o diagrama inteiro está montado, e aí sim ele sai.
 *
 * Isso resolve as duas coisas ao mesmo tempo: tem movimento em toda frase, e
 * o que aparece constrói um raciocínio em vez de piscar um card novo.
 */

export const INK = "#1C1C1C";
export const PAPER = colors.marfim;
const EXIT = 14;

/** Cor de traço padrão conforme o fundo do quadro. */
const inkOn = (dark: boolean) => (dark ? colors.marfim : INK);
const mutedOn = (dark: boolean) =>
  dark ? "rgba(248,243,231,0.52)" : "rgba(28,28,28,0.52)";
const hairOn = (dark: boolean) =>
  dark ? "rgba(248,243,231,0.16)" : "rgba(28,28,28,0.14)";

type BoardCtxValue = { start: number; duration: number; dark: boolean };
const BoardCtx = React.createContext<BoardCtxValue>({
  start: 0,
  duration: 1,
  dark: true,
});
export const useBoard = () => React.useContext(BoardCtx);

/** Frame absoluto em que a narração começa a frase `n` (1-indexado). */
export const frameOfLine = (n: number) => LINES[n - 1].from;

type Dir = "up" | "down" | "left" | "right" | "scale" | "fade" | "draw";

const shift = (dir: Dir, t: number, dist: number) => {
  const d = (1 - t) * dist;
  switch (dir) {
    case "up":
      return `translateY(${-d}px)`;
    case "down":
      return `translateY(${d}px)`;
    case "left":
      return `translateX(${-d}px)`;
    case "right":
      return `translateX(${d}px)`;
    case "scale":
      return `scale(${0.9 + t * 0.1})`;
    default:
      return "none";
  }
};

/**
 * Progresso de entrada de uma camada amarrada a uma frase.
 * Retorna 0 antes da frase começar e vai a 1 com mola logo depois.
 */
export const useBeat = (line: number, lag = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { start, duration } = useBoard();
  const delay = frameOfLine(line) - start + lag;
  const enter = Math.max(
    spring({ fps, frame: frame - delay, config: { damping: 20, stiffness: 150, mass: 0.7 } }),
    0,
  );
  const out = interpolate(frame, [duration - EXIT, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { t: enter, opacity: enter * out, started: frame >= delay };
};

/** Camada que entra na frase `line` e fica até o quadro acabar. */
export const Beat: React.FC<{
  line: number;
  dir?: Dir;
  lag?: number;
  dist?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ line, dir = "up", lag = 0, dist = 44, style, children }) => {
  const { t, opacity } = useBeat(line, lag);
  return (
    <div style={{ opacity, transform: shift(dir, t, dist), ...style }}>{children}</div>
  );
};

/** Camada que entra numa frase e sai em outra, liberando espaço no diagrama. */
export const BeatSpan: React.FC<{
  line: number;
  until: number;
  dir?: Dir;
  dist?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ line, until, dir = "up", dist = 44, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { start } = useBoard();
  const delay = frameOfLine(line) - start;
  const end = frameOfLine(until) - start;
  const enter = Math.max(
    spring({ fps, frame: frame - delay, config: { damping: 20, stiffness: 150, mass: 0.7 } }),
    0,
  );
  const leave = interpolate(frame, [end - 10, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ opacity: enter * leave, transform: shift(dir, enter, dist), ...style }}>
      {children}
    </div>
  );
};

/** Deriva lenta de câmera. Nunca para. */
const Drift: React.FC<{ children: React.ReactNode; seed: string; amount?: number }> = ({
  children,
  seed,
  amount = 14,
}) => {
  const frame = useCurrentFrame();
  const dx = random(seed + "x") > 0.5 ? 1 : -1;
  const dy = random(seed + "y") > 0.5 ? 1 : -1;
  const t = frame / 300;
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${dx * amount * t}px, ${dy * amount * 0.5 * t}px) scale(${1 + 0.018 * t})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Textura de fundo: malha fina + vinheta. Dá profundidade sem chamar atenção. */
const Texture: React.FC<{ dark: boolean }> = ({ dark }) => (
  <>
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${hairOn(dark)} 1px, transparent 1px), linear-gradient(90deg, ${hairOn(dark)} 1px, transparent 1px)`,
        backgroundSize: "96px 96px",
        opacity: 0.28,
      }}
    />
    <AbsoluteFill
      style={{
        background: dark
          ? "radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.42) 100%)"
          : "radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 44%, rgba(43,43,43,0.12) 100%)",
      }}
    />
  </>
);

export const CAPTION_SAFE = 268;

/**
 * Quadro. `lines` é o intervalo de frases que ele cobre; a duração vem daí.
 * `photo` põe uma foto de arquivo atrás, escurecida.
 */
export const Board: React.FC<{
  lines: [number, number];
  dark?: boolean;
  photo?: string;
  kicker?: string;
  title?: string;
  titleLine?: number;
  seed?: string;
  children?: React.ReactNode;
}> = ({ lines, dark = true, photo, kicker, title, titleLine, seed, children }) => {
  const [first, last] = lines;
  const start = frameOfLine(first);
  const end = LINES[last - 1].from + LINES[last - 1].durationInFrames;
  const duration = end - start;
  const key = seed ?? `b${first}`;
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  return (
    <BoardCtx.Provider value={{ start, duration, dark }}>
      <AbsoluteFill style={{ backgroundColor: dark ? INK : PAPER, opacity: fade }}>
        {photo ? <BoardPhoto src={photo} duration={duration} seed={key} /> : null}
        <Drift seed={key} amount={photo ? 20 : 12}>
          {!photo && <Texture dark={dark} />}
        </Drift>
        <AbsoluteFill
          style={{
            padding: `92px 120px ${CAPTION_SAFE}px`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {(kicker || title) && (
            <Beat line={titleLine ?? first} dir="left" dist={30} style={{ marginBottom: 34 }}>
              {kicker ? <Kicker dark={dark}>{kicker}</Kicker> : null}
              {title ? (
                <div
                  style={{
                    fontFamily: headlineFont,
                    fontWeight: 700,
                    fontSize: 62,
                    lineHeight: 1.08,
                    color: inkOn(dark),
                    marginTop: kicker ? 12 : 0,
                    letterSpacing: -0.5,
                  }}
                >
                  {title}
                </div>
              ) : null}
            </Beat>
          )}
          <div
            style={{
              flex: 1,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {children}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </BoardCtx.Provider>
  );
};

const BoardPhoto: React.FC<{ src: string; duration: number; seed: string }> = ({
  src,
  duration,
  seed,
}) => {
  const frame = useCurrentFrame();
  const zoomIn = random(seed) > 0.5;
  const p = frame / Math.max(duration, 1);
  const scale = zoomIn ? 1.06 + p * 0.12 : 1.18 - p * 0.12;
  const panX = (random(seed + "px") - 0.5) * 70 * p;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(`media/${src}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translateX(${panX}px)`,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: "rgba(20,20,20,0.66)" }} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(18,18,18,0.80) 0%, rgba(18,18,18,0.20) 40%, rgba(18,18,18,0.34) 70%, rgba(18,18,18,0.86) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Vocabulário de diagrama                                             */
/* ------------------------------------------------------------------ */

export const Kicker: React.FC<{ dark?: boolean; children: React.ReactNode }> = ({
  dark = true,
  children,
}) => (
  <div
    style={{
      fontFamily: monoFont,
      fontWeight: 600,
      fontSize: 21,
      letterSpacing: 4.5,
      textTransform: "uppercase",
      color: mutedOn(dark),
    }}
  >
    {children}
  </div>
);

/** Caixa de diagrama. É a unidade base de todo fluxo e organograma. */
export const Node: React.FC<{
  label: string;
  sub?: string;
  value?: string;
  accent?: string;
  width?: number;
  dark?: boolean;
  solid?: boolean;
  dim?: boolean;
}> = ({ label, sub, value, accent, width = 300, dark = true, solid = false, dim = false }) => {
  const line = accent ?? hairOn(dark);
  return (
    <div
      style={{
        width,
        padding: "22px 26px",
        borderRadius: 12,
        border: `2px solid ${line}`,
        backgroundColor: solid
          ? accent ?? colors.terracota
          : dark
            ? "rgba(248,243,231,0.045)"
            : "rgba(28,28,28,0.035)",
        opacity: dim ? 0.42 : 1,
      }}
    >
      <div
        style={{
          fontFamily: bodyFont,
          fontWeight: 600,
          fontSize: 28,
          color: solid ? INK : inkOn(dark),
          lineHeight: 1.2,
        }}
      >
        {label}
      </div>
      {sub ? (
        <div
          style={{
            fontFamily: bodyFont,
            fontSize: 21,
            color: solid ? "rgba(28,28,28,0.7)" : mutedOn(dark),
            marginTop: 6,
            lineHeight: 1.3,
          }}
        >
          {sub}
        </div>
      ) : null}
      {value ? (
        <div
          style={{
            fontFamily: monoFont,
            fontWeight: 600,
            fontSize: 30,
            color: accent && !solid ? accent : solid ? INK : inkOn(dark),
            marginTop: 12,
          }}
        >
          {value}
        </div>
      ) : null}
    </div>
  );
};

/**
 * Seta de fluxo. O tracejado corre sempre, então mesmo parada a seta
 * comunica que tem dinheiro passando por ali.
 */
export const Flow: React.FC<{
  d: string;
  color?: string;
  progress: number;
  width?: number;
  dashed?: boolean;
  head?: boolean;
}> = ({ d, color = colors.pedra, progress, width = 2.5, dashed = true, head = true }) => {
  const frame = useCurrentFrame();
  const id = React.useId();
  return (
    <>
      <defs>
        <marker
          id={`h${id}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={dashed ? "0.022 0.018" : 1}
        strokeDashoffset={dashed ? -(frame * 0.0016) % 0.04 : 1 - progress}
        opacity={dashed ? progress : 1}
        markerEnd={head && progress > 0.85 ? `url(#h${id})` : undefined}
      />
    </>
  );
};

/** Número que conta até o valor. Mono, para parecer leitura de instrumento. */
export const Counter: React.FC<{
  to: number;
  progress: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  size?: number;
  color?: string;
}> = ({ to, progress, prefix = "", suffix = "", decimals = 0, size = 128, color }) => {
  const eased = interpolate(progress, [0, 1], [0, 1], { easing: Easing.out(Easing.cubic) });
  return (
    <span
      style={{
        fontFamily: monoFont,
        fontWeight: 600,
        fontSize: size,
        letterSpacing: -2,
        color: color ?? colors.marfim,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {prefix}
      {(to * eased).toFixed(decimals)}
      {suffix}
    </span>
  );
};

/** Barra horizontal com rótulo direto. Nunca depende de legenda. */
export const Bar: React.FC<{
  label: string;
  value: string;
  progress: number;
  fraction: number;
  color?: string;
  dark?: boolean;
  note?: string;
}> = ({ label, value, progress, fraction, color = colors.pedra, dark = true, note }) => (
  <div style={{ marginBottom: 26 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 10,
      }}
    >
      <span style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 27, color: inkOn(dark) }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: monoFont,
          fontWeight: 600,
          fontSize: 27,
          color,
          opacity: progress,
        }}
      >
        {value}
      </span>
    </div>
    <div
      style={{
        height: 18,
        borderRadius: 9,
        backgroundColor: dark ? "rgba(248,243,231,0.08)" : "rgba(28,28,28,0.07)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${Math.min(fraction, 1) * progress * 100}%`,
          borderRadius: 9,
          backgroundColor: color,
        }}
      />
    </div>
    {note ? (
      <div
        style={{
          fontFamily: bodyFont,
          fontSize: 20,
          color: mutedOn(dark),
          marginTop: 8,
          opacity: progress,
        }}
      >
        {note}
      </div>
    ) : null}
  </div>
);

/** Carimbo de dossiê. Entra torto, como se tivesse sido batido na mesa. */
export const Stamp: React.FC<{
  text: string;
  progress: number;
  color?: string;
  angle?: number;
  size?: number;
}> = ({ text, progress, color = colors.terracota, angle = -9, size = 34 }) => (
  <div
    style={{
      display: "inline-block",
      padding: "10px 20px",
      border: `3px solid ${color}`,
      borderRadius: 6,
      color,
      fontFamily: monoFont,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: 3,
      textTransform: "uppercase",
      opacity: progress,
      transform: `rotate(${angle}deg) scale(${interpolate(progress, [0, 1], [1.5, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      })})`,
    }}
  >
    {text}
  </div>
);

/** Marcador de lista: risco, ponto ou visto, desenhado em SVG. */
export const Mark: React.FC<{ kind: "cross" | "check" | "dot"; progress: number; color: string }> = ({
  kind,
  progress,
  color,
}) => (
  <svg width={30} height={30} viewBox="0 0 30 30" style={{ flexShrink: 0, marginTop: 4 }}>
    <circle cx={15} cy={15} r={13} fill="none" stroke={color} strokeWidth={2} opacity={0.5} />
    {kind === "dot" ? (
      <circle cx={15} cy={15} r={5.5 * progress} fill={color} />
    ) : (
      <path
        d={kind === "cross" ? "M10 10 L20 20 M20 10 L10 20" : "M9 15.5 L13.5 20 L21 10"}
        fill="none"
        stroke={color}
        strokeWidth={2.8}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
      />
    )}
  </svg>
);

/** Linha de uma lista que cresce frase a frase. */
export const Row: React.FC<{
  line: number;
  kind?: "cross" | "check" | "dot";
  color?: string;
  children: React.ReactNode;
  strong?: boolean;
}> = ({ line, kind = "dot", color, children, strong = false }) => {
  const { dark } = useBoard();
  const { t, opacity } = useBeat(line);
  const c = color ?? (dark ? colors.pedra : colors.cacau);
  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        alignItems: "flex-start",
        marginBottom: 22,
        opacity,
        transform: `translateX(${(1 - t) * 26}px)`,
      }}
    >
      <Mark kind={kind} progress={t} color={c} />
      <span
        style={{
          fontFamily: bodyFont,
          fontWeight: strong ? 600 : 400,
          fontSize: 31,
          lineHeight: 1.36,
          color: strong ? inkOn(dark) : dark ? "rgba(248,243,231,0.86)" : "rgba(28,28,28,0.84)",
        }}
      >
        {children}
      </span>
    </div>
  );
};

/** Gráfico de linha que se desenha. Serve de espinha para blocos longos. */
export const LineChart: React.FC<{
  points: { x: number; y: number }[];
  progress: number;
  color?: string;
  width: number;
  height: number;
  fill?: boolean;
}> = ({ points, progress, color = colors.oliva, width, height, fill = true }) => {
  const id = React.useId();
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x * width} ${height - p.y * height}`)
    .join(" ");
  const lastX = points[points.length - 1].x * width;
  const area = `${d} L ${lastX} ${height} L 0 ${height} Z`;
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
        <clipPath id={`c${id}`}>
          <rect x={0} y={-40} width={width * progress} height={height + 80} />
        </clipPath>
      </defs>
      <g clipPath={`url(#c${id})`}>
        {fill ? <path d={area} fill={`url(#g${id})`} /> : null}
        <path d={d} fill="none" stroke={color} strokeWidth={3.5} strokeLinejoin="round" />
      </g>
    </svg>
  );
};

/** Ponto marcado sobre o gráfico, com rótulo direto. */
export const Pin: React.FC<{
  x: number;
  y: number;
  label: string;
  value?: string;
  progress: number;
  color?: string;
  side?: "up" | "down";
}> = ({ x, y, label, value, progress, color = colors.marfim, side = "up" }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      opacity: progress,
      transform: `translate(-50%, ${side === "up" ? "-100%" : "0"}) translateY(${(1 - progress) * 12}px)`,
      textAlign: "center",
      whiteSpace: "nowrap",
    }}
  >
    {side === "up" ? null : <Dotted color={color} progress={progress} />}
    <div
      style={{
        fontFamily: monoFont,
        fontWeight: 600,
        fontSize: 19,
        letterSpacing: 2,
        textTransform: "uppercase",
        color,
        opacity: 0.75,
      }}
    >
      {label}
    </div>
    {value ? (
      <div style={{ fontFamily: monoFont, fontWeight: 600, fontSize: 30, color }}>{value}</div>
    ) : null}
    {side === "up" ? <Dotted color={color} progress={progress} /> : null}
  </div>
);

const Dotted: React.FC<{ color: string; progress: number }> = ({ color, progress }) => (
  <div
    style={{
      width: 2,
      height: 26 * progress,
      margin: "6px auto 0",
      backgroundColor: color,
      opacity: 0.45,
    }}
  />
);

/** Grade de células. Usada para "quanto do total é isso". */
export const CellGrid: React.FC<{
  total: number;
  marked: number;
  progress: number;
  cols: number;
  size?: number;
  color?: string;
  baseColor?: string;
}> = ({ total, marked, progress, cols, size = 30, color = colors.terracota, baseColor }) => {
  const shown = Math.round(marked * progress);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${size}px)`,
        gap: 8,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: 4,
            backgroundColor: i < shown ? color : baseColor ?? "rgba(248,243,231,0.11)",
          }}
        />
      ))}
    </div>
  );
};
