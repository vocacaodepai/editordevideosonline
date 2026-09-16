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

/**
 * Motor de dinâmica do episódio.
 *
 * Regra do formato: nenhum plano fica parado. Todo plano tem entrada,
 * movimento contínuo enquanto está no ar, e saída. Planos duram de 3 a 10
 * segundos (uma ou duas frases da narração), então a tela muda o tempo todo.
 */

const DARK = colors.carvao;
const LIGHT = colors.marfim;
const MUTED_DARK = "rgba(248,243,231,0.55)";
const MUTED_LIGHT = "rgba(43,43,43,0.55)";

const EXIT_FRAMES = 12;

/** Entrada com mola + saída no fim do plano. Todo elemento passa por aqui. */
const useLife = (delay: number, duration: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    fps,
    frame: frame - delay,
    config: { damping: 18, stiffness: 140, mass: 0.7 },
  });
  const exit = interpolate(frame, [duration - EXIT_FRAMES, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { enter: Math.max(enter, 0), opacity: Math.max(enter, 0) * exit, exit };
};

type EnterFrom = "up" | "down" | "left" | "right" | "scale" | "fade";

const offsetFor = (from: EnterFrom, t: number) => {
  const d = (1 - t) * 60;
  switch (from) {
    case "up":
      return `translateY(${-d}px)`;
    case "down":
      return `translateY(${d}px)`;
    case "left":
      return `translateX(${-d}px)`;
    case "right":
      return `translateX(${d}px)`;
    case "scale":
      return `scale(${0.88 + t * 0.12})`;
    default:
      return "none";
  }
};

/** Elemento que entra num momento do plano e sai junto com ele. */
export const In: React.FC<{
  at?: number;
  from?: EnterFrom;
  duration: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at = 0, from = "up", duration, children, style }) => {
  const { enter, opacity } = useLife(at, duration);
  return (
    <div style={{ opacity, transform: offsetFor(from, enter), ...style }}>{children}</div>
  );
};

/** Deriva contínua de câmera. Nunca para, nem quando nada mais se move. */
export const Drift: React.FC<{
  children: React.ReactNode;
  seed?: string;
  amount?: number;
  zoom?: number;
}> = ({ children, seed = "a", amount = 18, zoom = 0.03 }) => {
  const frame = useCurrentFrame();
  const dirX = random(seed + "x") > 0.5 ? 1 : -1;
  const dirY = random(seed + "y") > 0.5 ? 1 : -1;
  const t = frame / 240;
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${dirX * amount * t}px, ${dirY * amount * 0.6 * t}px) scale(${1 + zoom * t})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Foto de arquivo com Ken Burns, escurecida pro texto respirar. */
export const Photo: React.FC<{
  src: string;
  duration: number;
  dim?: number;
  seed?: string;
}> = ({ src, duration, dim = 0.62, seed = "p" }) => {
  const frame = useCurrentFrame();
  const zoomIn = random(seed) > 0.5;
  const p = frame / Math.max(duration, 1);
  const scale = zoomIn ? 1.06 + p * 0.1 : 1.16 - p * 0.1;
  const panX = (random(seed + "px") - 0.5) * 60 * p;
  const fadeIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [duration - EXIT_FRAMES, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut, overflow: "hidden" }}>
      <Img
        src={staticFile(`media/${src}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translateX(${panX}px)`,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: `rgba(24,24,24,${dim})` }} />
      {/* degradê extra onde entra texto: topo (kicker/título) e base (legenda) */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(20,20,20,0.72) 0%, rgba(20,20,20,0.18) 42%, rgba(20,20,20,0.30) 72%, rgba(20,20,20,0.78) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const Kicker: React.FC<{ children: React.ReactNode; onDark?: boolean; color?: string }> = ({
  children,
  onDark = true,
  color,
}) => (
  <div
    style={{
      fontFamily: monoFont,
      fontWeight: 600,
      fontSize: 24,
      letterSpacing: 4,
      textTransform: "uppercase",
      color: color ?? (onDark ? MUTED_DARK : MUTED_LIGHT),
    }}
  >
    {children}
  </div>
);

export const Title: React.FC<{
  children: React.ReactNode;
  onDark?: boolean;
  size?: number;
  center?: boolean;
}> = ({ children, onDark = true, size = 78, center }) => (
  <div
    style={{
      fontFamily: headlineFont,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.2,
      color: onDark ? colors.marfim : colors.carvao,
      textAlign: center ? "center" : "left",
    }}
  >
    {children}
  </div>
);

/** Moldura padrão: fundo, deriva e área segura acima da legenda. */
export const Frame: React.FC<{
  duration: number;
  dark?: boolean;
  photo?: string;
  center?: boolean;
  seed?: string;
  children: React.ReactNode;
}> = ({ duration, dark = true, photo, center, seed = "s", children }) => (
  <AbsoluteFill style={{ backgroundColor: dark ? DARK : LIGHT }}>
    {photo && <Photo src={photo} duration={duration} seed={seed} />}
    <Drift seed={seed} amount={photo ? 0 : 14} zoom={photo ? 0 : 0.02}>
      <AbsoluteFill
        style={{
          padding: "96px 96px 300px",
          justifyContent: center ? "center" : "flex-start",
          alignItems: center ? "center" : "flex-start",
        }}
      >
        {children}
      </AbsoluteFill>
    </Drift>
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* Tipos de plano                                                       */
/* ------------------------------------------------------------------ */

export const ShotPhoto: React.FC<{
  duration: number;
  photo: string;
  kicker?: string;
  title?: string;
  seed?: string;
}> = ({ duration, photo, kicker, title, seed }) => (
  <Frame duration={duration} photo={photo} seed={seed}>
    {kicker && (
      <In at={6} duration={duration} from="left">
        <Kicker>{kicker}</Kicker>
      </In>
    )}
    {title && (
      <In at={14} duration={duration} from="up" style={{ marginTop: 16, maxWidth: 1400 }}>
        <Title size={84}>{title}</Title>
      </In>
    )}
  </Frame>
);

export const ShotNumber: React.FC<{
  duration: number;
  value: string;
  label: string;
  kicker?: string;
  photo?: string;
  countTo?: number;
  suffix?: string;
  prefix?: string;
}> = ({ duration, value, label, kicker, photo, countTo, prefix = "", suffix = "" }) => {
  const frame = useCurrentFrame();
  const counted =
    countTo !== undefined
      ? `${prefix}${interpolate(frame, [8, Math.min(70, duration - 20)], [0, countTo], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        })
          .toFixed(countTo % 1 === 0 ? 0 : 1)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${suffix}`
      : value;

  return (
    <Frame duration={duration} photo={photo} center seed={label}>
      {kicker && (
        <In at={2} duration={duration} from="down">
          <Kicker>{kicker}</Kicker>
        </In>
      )}
      <In at={8} duration={duration} from="scale" style={{ marginTop: 18 }}>
        <div
          style={{
            fontFamily: headlineFont,
            fontWeight: 700,
            fontSize: 188,
            lineHeight: 1.18,
            color: colors.terracota,
            fontVariantNumeric: "tabular-nums",
            textAlign: "center",
          }}
        >
          {counted}
        </div>
      </In>
      <In at={26} duration={duration} from="up" style={{ marginTop: 6 }}>
        <div
          style={{
            width: 360,
            height: 3,
            backgroundColor: colors.terracota,
            borderRadius: 3,
            margin: "0 auto 22px",
          }}
        />
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 600,
            fontSize: 36,
            color: colors.marfim,
            textAlign: "center",
          }}
        >
          {label}
        </div>
      </In>
    </Frame>
  );
};

export const ShotStatement: React.FC<{
  duration: number;
  text: string;
  kicker?: string;
  dark?: boolean;
  accent?: string;
  photo?: string;
}> = ({ duration, text, kicker, dark = true, accent, photo }) => (
  <Frame duration={duration} dark={dark} photo={photo} center seed={text.slice(0, 6)}>
    {kicker && (
      <In at={2} duration={duration} from="down">
        <Kicker onDark={dark}>{kicker}</Kicker>
      </In>
    )}
    <In at={10} duration={duration} from="scale" style={{ marginTop: 22, maxWidth: 1500 }}>
      <Title onDark={dark} size={86} center>
        {accent ? (
          <>
            {text.split(accent)[0]}
            <span style={{ color: colors.terracota }}>{accent}</span>
            {text.split(accent)[1]}
          </>
        ) : (
          text
        )}
      </Title>
    </In>
  </Frame>
);

export const ShotStats: React.FC<{
  duration: number;
  kicker?: string;
  title?: string;
  stats: { value: string; label: string; accent?: boolean }[];
  dark?: boolean;
  photo?: string;
}> = ({ duration, kicker, title, stats, dark = true, photo }) => (
  <Frame duration={duration} dark={dark} photo={photo} seed={kicker}>
    {kicker && (
      <In at={0} duration={duration} from="left">
        <Kicker onDark={dark}>{kicker}</Kicker>
      </In>
    )}
    {title && (
      <In at={6} duration={duration} from="up" style={{ marginTop: 14 }}>
        <Title onDark={dark} size={72}>
          {title}
        </Title>
      </In>
    )}
    <div style={{ display: "flex", gap: 28, marginTop: 84 }}>
      {stats.map((s, i) => (
        <In key={s.label} at={18 + i * 14} duration={duration} from="down">
          <div
            style={{
              backgroundColor: dark ? "rgba(248,243,231,0.07)" : colors.areia,
              borderRadius: 18,
              padding: "32px 42px",
              minWidth: 320,
            }}
          >
            <div
              style={{
                fontFamily: headlineFont,
                fontWeight: 700,
                fontSize: 86,
                lineHeight: 1.1,
                color: s.accent ? colors.terracota : dark ? colors.marfim : colors.carvao,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {s.value}
            </div>
            <div style={{ marginTop: 10 }}>
              <Kicker onDark={dark}>{s.label}</Kicker>
            </div>
          </div>
        </In>
      ))}
    </div>
  </Frame>
);

export const ShotBars: React.FC<{
  duration: number;
  kicker?: string;
  title?: string;
  bars: { name: string; value: number; display: string; accent?: boolean }[];
  max: number;
  note?: string;
  dark?: boolean;
}> = ({ duration, kicker, title, bars, max, note, dark = false }) => {
  const frame = useCurrentFrame();
  return (
    <Frame duration={duration} dark={dark} seed={title}>
      {kicker && (
        <In at={0} duration={duration} from="left">
          <Kicker onDark={dark}>{kicker}</Kicker>
        </In>
      )}
      {title && (
        <In at={5} duration={duration} from="up" style={{ marginTop: 14 }}>
          <Title onDark={dark} size={70}>
            {title}
          </Title>
        </In>
      )}
      <div style={{ marginTop: 70, width: "100%", display: "flex", flexDirection: "column", gap: 40 }}>
        {bars.map((b, i) => {
          const grow = interpolate(frame, [16 + i * 12, 60 + i * 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          return (
            <In key={b.name} at={14 + i * 12} duration={duration} from="left">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 36, color: dark ? colors.marfim : colors.carvao }}>
                  {b.name}
                </div>
                <div
                  style={{
                    fontFamily: headlineFont,
                    fontWeight: 700,
                    fontSize: 46,
                    color: b.accent ? colors.terracota : dark ? colors.marfim : colors.carvao,
                    opacity: grow > 0.9 ? 1 : 0,
                  }}
                >
                  {b.display}
                </div>
              </div>
              <div
                style={{
                  height: 62,
                  width: `${(b.value / max) * 100 * grow}%`,
                  backgroundColor: b.accent ? colors.terracota : dark ? "rgba(248,243,231,0.25)" : colors.pedra,
                  borderRadius: "0 8px 8px 0",
                }}
              />
            </In>
          );
        })}
      </div>
      {note && (
        <In at={72} duration={duration} from="up" style={{ marginTop: 56 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <div style={{ width: 4, height: 56, backgroundColor: colors.oliva, borderRadius: 4 }} />
            <div style={{ fontFamily: bodyFont, fontSize: 30, color: dark ? colors.marfim : colors.carvao }}>{note}</div>
          </div>
        </In>
      )}
    </Frame>
  );
};

export const ShotCards: React.FC<{
  duration: number;
  kicker?: string;
  title?: string;
  cards: { tag?: string; title: string; body?: string }[];
  dark?: boolean;
  accent?: string;
}> = ({ duration, kicker, title, cards, dark = true, accent = colors.terracota }) => (
  <Frame duration={duration} dark={dark} seed={title}>
    {kicker && (
      <In at={0} duration={duration} from="left">
        <Kicker onDark={dark}>{kicker}</Kicker>
      </In>
    )}
    {title && (
      <In at={5} duration={duration} from="up" style={{ marginTop: 14 }}>
        <Title onDark={dark} size={70}>
          {title}
        </Title>
      </In>
    )}
    <div
      style={{
        display: "flex",
        gap: 34,
        marginTop: cards.length === 1 ? 110 : 72,
        width: "100%",
      }}
    >
      {cards.map((c, i) => (
        <In key={c.title} at={16 + i * 20} duration={duration} from="down" style={{ flex: 1 }}>
          <div
            style={{
              backgroundColor: dark ? "rgba(248,243,231,0.06)" : colors.areia,
              border: `2px solid ${accent}`,
              borderRadius: 18,
              padding: cards.length === 1 ? "56px 64px" : "34px 38px",
              height: "100%",
            }}
          >
            {c.tag && <Kicker onDark={dark} color={accent}>{c.tag}</Kicker>}
            <div style={{ marginTop: 16 }}>
              <Title onDark={dark} size={cards.length === 1 ? 86 : 50}>
                {c.title}
              </Title>
            </div>
            {c.body && (
              <div
                style={{
                  marginTop: cards.length === 1 ? 26 : 18,
                  fontFamily: bodyFont,
                  fontSize: cards.length === 1 ? 38 : 29,
                  lineHeight: 1.45,
                  color: dark ? "rgba(248,243,231,0.75)" : MUTED_LIGHT,
                  maxWidth: cards.length === 1 ? 1200 : undefined,
                }}
              >
                {c.body}
              </div>
            )}
          </div>
        </In>
      ))}
    </div>
  </Frame>
);

/** Lista que vai se montando item a item. */
export const ShotList: React.FC<{
  duration: number;
  kicker?: string;
  title?: string;
  items: string[];
  dark?: boolean;
  marker?: "cross" | "dot" | "check";
}> = ({ duration, kicker, title, items, dark = false, marker = "cross" }) => (
  <Frame duration={duration} dark={dark} seed={title}>
    {kicker && (
      <In at={0} duration={duration} from="left">
        <Kicker onDark={dark}>{kicker}</Kicker>
      </In>
    )}
    {title && (
      <In at={5} duration={duration} from="up" style={{ marginTop: 14 }}>
        <Title onDark={dark} size={70}>
          {title}
        </Title>
      </In>
    )}
    <div style={{ marginTop: 70, display: "flex", flexDirection: "column", gap: 28 }}>
      {items.map((item, i) => (
        <In key={item} at={16 + i * 18} duration={duration} from="left">
          <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: marker === "dot" ? "50%" : 8,
                border: `3px solid ${marker === "check" ? colors.oliva : colors.terracota}`,
                backgroundColor: marker === "dot" ? colors.terracota : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: monoFont,
                fontSize: 26,
                color: marker === "check" ? colors.oliva : colors.terracota,
                flexShrink: 0,
              }}
            >
              {marker === "cross" ? "✕" : marker === "check" ? "✓" : ""}
            </div>
            <div style={{ fontFamily: bodyFont, fontSize: 36, color: dark ? colors.marfim : colors.carvao }}>{item}</div>
          </div>
        </In>
      ))}
    </div>
  </Frame>
);

/** Linha do tempo cujos marcos entram um a um. */
export const ShotTimeline: React.FC<{
  duration: number;
  kicker?: string;
  title?: string;
  marks: { label: string; note: string; accent?: boolean }[];
  dark?: boolean;
}> = ({ duration, kicker, title, marks, dark = false }) => {
  const frame = useCurrentFrame();
  const lineGrow = interpolate(frame, [12, 12 + marks.length * 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <Frame duration={duration} dark={dark} seed={title}>
      {kicker && (
        <In at={0} duration={duration} from="left">
          <Kicker onDark={dark}>{kicker}</Kicker>
        </In>
      )}
      {title && (
        <In at={5} duration={duration} from="up" style={{ marginTop: 14 }}>
          <Title onDark={dark} size={70}>
            {title}
          </Title>
        </In>
      )}
      <div style={{ position: "relative", marginTop: 130, height: 260, width: "100%" }}>
        <div
          style={{
            position: "absolute",
            top: 58,
            left: 0,
            height: 3,
            width: `${lineGrow * 100}%`,
            backgroundColor: dark ? "rgba(248,243,231,0.4)" : colors.carvao,
          }}
        />
        {marks.map((m, i) => (
          <div key={m.label} style={{ position: "absolute", left: `${(i / (marks.length - 1)) * 100}%`, top: 0 }}>
            <In at={14 + i * 16} duration={duration} from="down" style={{ transform: "translateX(-50%)", width: 300, textAlign: "center" }}>
              <div
                style={{
                  fontFamily: headlineFont,
                  fontWeight: 700,
                  fontSize: 54,
                  color: m.accent ? colors.terracota : dark ? colors.marfim : colors.carvao,
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: m.accent ? colors.terracota : dark ? colors.marfim : colors.carvao,
                  margin: "12px auto 16px",
                }}
              />
              <div style={{ fontFamily: bodyFont, fontSize: 25, color: dark ? MUTED_DARK : MUTED_LIGHT }}>{m.note}</div>
            </In>
          </div>
        ))}
      </div>
    </Frame>
  );
};

/** Diagrama do dinheiro, montado nó a nó. */
export const ShotFlow: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const partners = ["Partner A", "Partner B", "Partner C"];
  const linkOn = (i: number) =>
    interpolate(frame, [30 + i * 14, 52 + i * 14], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const vault = spring({
    fps: 30,
    frame: frame - 84,
    config: { damping: 13, stiffness: 150, mass: 0.6 },
  });
  const dash = -(frame * 1.6) % 18;

  return (
    <Frame duration={duration} seed="flow">
      <In at={0} duration={duration} from="left">
        <Kicker>Reported structure · third party acquiring</Kicker>
      </In>
      <In at={5} duration={duration} from="up" style={{ marginTop: 14 }}>
        <Title size={66}>Where the profits were supposed to sit</Title>
      </In>

      <svg width={1728} height={400} style={{ marginTop: 46, overflow: "visible" }}>
        <g opacity={interpolate(frame, [10, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <rect x={0} y={150} width={340} height={110} rx={14} fill="rgba(248,243,231,0.09)" />
          <text x={170} y={197} textAnchor="middle" fontFamily={bodyFont} fontWeight={600} fontSize={34} fill={colors.marfim}>
            Wirecard AG
          </text>
          <text x={170} y={235} textAnchor="middle" fontFamily={monoFont} fontSize={22} fill={MUTED_DARK}>
            MUNICH
          </text>
        </g>

        {partners.map((p, i) => {
          const y = 40 + i * 135;
          const o = linkOn(i);
          return (
            <g key={p} opacity={o}>
              <path
                d={`M 340 205 C 520 205, 520 ${y + 38}, 700 ${y + 38}`}
                fill="none"
                stroke={colors.pedra}
                strokeWidth={3}
                strokeDasharray="10 8"
                strokeDashoffset={dash}
              />
              <rect x={700} y={y} width={300} height={76} rx={12} fill="rgba(248,243,231,0.06)" stroke={colors.pedra} strokeWidth={2} />
              <text x={850} y={y + 48} textAnchor="middle" fontFamily={bodyFont} fontSize={28} fill={colors.marfim}>
                {p}
              </text>
              <path
                d={`M 1000 ${y + 38} C 1160 ${y + 38}, 1160 205, 1320 205`}
                fill="none"
                stroke={colors.pedra}
                strokeWidth={3}
                strokeDasharray="10 8"
                strokeDashoffset={dash}
              />
            </g>
          );
        })}

        <g transform={`translate(1320 120) scale(${Math.max(vault, 0)})`}>
          <rect x={0} y={0} width={400} height={170} rx={14} fill={colors.terracota} />
          <text x={200} y={62} textAnchor="middle" fontFamily={monoFont} fontSize={22} letterSpacing={3} fill={colors.marfim}>
            TRUSTEE ACCOUNTS
          </text>
          <text x={200} y={122} textAnchor="middle" fontFamily={headlineFont} fontWeight={700} fontSize={54} fill={colors.marfim}>
            €1.9bn
          </text>
          <text x={200} y={158} textAnchor="middle" fontFamily={monoFont} fontSize={20} fill="rgba(248,243,231,0.75)">
            PHILIPPINES
          </text>
        </g>
      </svg>
    </Frame>
  );
};

/** Grade de 100 células: a fatia do balanço que não existia. */
export const ShotGrid: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [14, 74], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <Frame duration={duration} center seed="grid">
      <In at={0} duration={duration} from="down">
        <Kicker>Share of Wirecard&rsquo;s reported balance sheet</Kicker>
      </In>
      <div style={{ display: "flex", flexWrap: "wrap", width: 1000, gap: 7, marginTop: 34, justifyContent: "center" }}>
        {Array.from({ length: 100 }).map((_, i) => {
          const on = i / 100 < fill;
          return (
            <div
              key={i}
              style={{
                width: 86,
                height: 20,
                borderRadius: 4,
                backgroundColor: i < 25 ? colors.terracota : "rgba(248,243,231,0.16)",
                opacity: on ? 1 : 0.1,
                transform: on ? "scale(1)" : "scale(0.7)",
              }}
            />
          );
        })}
      </div>
      <In at={78} duration={duration} from="up" style={{ marginTop: 34 }}>
        <div
          style={{
            fontFamily: headlineFont,
            fontWeight: 700,
            fontSize: 54,
            color: colors.terracota,
            textAlign: "center",
          }}
        >
          one in every four euros on the books
        </div>
      </In>
    </Frame>
  );
};

/** O colapso dos sete dias, com cada marcação entrando no tempo certo. */
export const ShotCollapse: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const chartW = 1560;
  const chartH = 420;
  const series = [104, 104, 39, 25, 25, 14, 12, 3, 2.5];
  const maxY = 110;
  const draw = interpolate(frame, [16, duration - 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const visible = Math.max(2, Math.round(series.length * draw));
  const pt = (v: number, i: number) => ({
    x: (i / (series.length - 1)) * chartW,
    y: chartH - (v / maxY) * chartH,
  });
  const coords = series.slice(0, visible).map(pt);
  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const head = coords[coords.length - 1];
  const events = [
    { i: 2, label: "18 Jun · EY refuses to sign" },
    { i: 4, label: "19 Jun · CEO resigns" },
    { i: 6, label: "23 Jun · CEO arrested" },
    { i: 8, label: "25 Jun · insolvency" },
  ];
  const pulse = 10 + Math.sin(frame / 6) * 3;

  return (
    <Frame duration={duration} seed="collapse">
      <In at={0} duration={duration} from="left">
        <Kicker>Wirecard share price · June 2020</Kicker>
      </In>
      <In at={5} duration={duration} from="up" style={{ marginTop: 14 }}>
        <Title size={70}>Seven days</Title>
      </In>
      <svg width={chartW} height={chartH + 70} style={{ marginTop: 56, overflow: "visible" }}>
        {[0, 0.5, 1].map((g) => (
          <line key={g} x1={0} y1={chartH * g} x2={chartW} y2={chartH * g} stroke="rgba(248,243,231,0.12)" strokeWidth={1} />
        ))}
        <path d={`${path} L ${head.x} ${chartH} L 0 ${chartH} Z`} fill={colors.terracota} opacity={0.14} />
        <path d={path} fill="none" stroke={colors.terracota} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={head.x} cy={head.y} r={pulse} fill={colors.terracota} stroke={DARK} strokeWidth={4} />
        <line x1={0} y1={chartH} x2={chartW} y2={chartH} stroke="rgba(248,243,231,0.4)" strokeWidth={2} />
        {events.map((e) => {
          const p = pt(series[e.i], e.i);
          const on = visible > e.i;
          return (
            <g key={e.label} opacity={on ? 1 : 0}>
              <line x1={p.x} y1={p.y} x2={p.x} y2={chartH} stroke="rgba(248,243,231,0.25)" strokeWidth={2} strokeDasharray="6 6" />
              <circle cx={p.x} cy={p.y} r={8} fill={colors.marfim} />
              <text x={p.x} y={p.y - 26} textAnchor={e.i > 5 ? "end" : "middle"} fontFamily={monoFont} fontSize={22} fill={colors.marfim}>
                {e.label}
              </text>
            </g>
          );
        })}
      </svg>
    </Frame>
  );
};

/** Cartão de título com a logo oficial (domínio público, Wikimedia). */
export const ShotTitle: React.FC<{ duration: number }> = ({ duration }) => (
  <Frame duration={duration} center seed="title">
    <In at={0} duration={duration} from="down">
      <Kicker>Scandal files · episode 01</Kicker>
    </In>
    <In at={8} duration={duration} from="scale" style={{ marginTop: 26 }}>
      <Title size={122} center>
        The money that
        <br />
        never existed
      </Title>
    </In>
    <In at={30} duration={duration} from="up" style={{ marginTop: 30 }}>
      <Img src={staticFile("media/logo.png")} style={{ height: 72, objectFit: "contain", filter: "invert(1) brightness(1.6)" }} />
    </In>
    <In at={44} duration={duration} from="up" style={{ marginTop: 22 }}>
      <div style={{ fontFamily: bodyFont, fontSize: 32, color: colors.lavanda }}>Wirecard AG · 1999 &ndash; 2020</div>
    </In>
  </Frame>
);

/** Ficha do foragido. */
export const ShotWanted: React.FC<{ duration: number }> = ({ duration }) => (
  <Frame duration={duration} photo="court.jpg" center seed="wanted">
    <In at={0} duration={duration} from="down">
      <Kicker color={colors.terracota}>status · wanted</Kicker>
    </In>
    <In at={8} duration={duration} from="scale" style={{ marginTop: 18 }}>
      <Title size={110} center>
        Jan Marsalek
      </Title>
    </In>
    <In at={26} duration={duration} from="up" style={{ marginTop: 24, maxWidth: 1200 }}>
      <div style={{ fontFamily: bodyFont, fontSize: 36, lineHeight: 1.45, color: "rgba(248,243,231,0.85)", textAlign: "center" }}>
        Chief operating officer. Ran the Asian business. Suspended, dismissed, and then gone.
      </div>
    </In>
  </Frame>
);

/** Créditos de imagem, obrigatório pelas licenças Creative Commons. */
export const ShotCredits: React.FC<{ duration: number; lines: string[] }> = ({ duration, lines }) => (
  <Frame duration={duration} center seed="credits">
    <In at={0} duration={duration} from="down">
      <Kicker>Image credits · Wikimedia Commons</Kicker>
    </In>
    <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
      {lines.map((l, i) => (
        <In key={l} at={8 + i * 6} duration={duration} from="up">
          <div style={{ fontFamily: bodyFont, fontSize: 26, color: "rgba(248,243,231,0.7)" }}>{l}</div>
        </In>
      ))}
    </div>
  </Frame>
);
