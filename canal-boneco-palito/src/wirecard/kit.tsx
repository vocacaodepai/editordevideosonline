import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { colors } from "../theme";
import { bodyFont, headlineFont, monoFont } from "../fonts";

// Linguagem visual do episódio: dossiê editorial. Etiquetas em mono,
// manchete em serifa, dado em número grande. Terracota é reservada pro que
// deu errado; oliva pro que é verificado; lavanda só sobre fundo escuro.
export const ink = { onDark: colors.marfim, onLight: colors.carvao };
export const muted = {
  onDark: "rgba(248,243,231,0.52)",
  onLight: "rgba(43,43,43,0.52)",
};

export const useFade = (from: number, to: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

export const usePop = (delay: number, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return Math.max(
    spring({ fps, frame: frame - delay, config: { damping, stiffness: 150, mass: 0.6 } }),
    0,
  );
};

export const useGrow = (from: number, to: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
};

/** Etiqueta pequena em mono, o "carimbo de arquivo" do episódio. */
export const Label: React.FC<{
  children: React.ReactNode;
  onDark?: boolean;
  color?: string;
  size?: number;
  opacity?: number;
}> = ({ children, onDark, color, size = 24, opacity = 1 }) => (
  <div
    style={{
      fontFamily: monoFont,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: 4,
      textTransform: "uppercase",
      color: color ?? (onDark ? muted.onDark : muted.onLight),
      opacity,
    }}
  >
    {children}
  </div>
);

/** Manchete serifada da cena. */
export const Headline: React.FC<{
  children: React.ReactNode;
  onDark?: boolean;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, onDark, size = 76, style }) => (
  <div
    style={{
      fontFamily: headlineFont,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.18,
      color: onDark ? ink.onDark : ink.onLight,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Carimbo diagonal, usado nos momentos em que algo é negado ou não confirmado. */
export const Stamp: React.FC<{
  children: React.ReactNode;
  delay: number;
  color?: string;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({ children, delay, color = colors.terracota, rotate = -7, style }) => {
  const pop = usePop(delay, 10);
  return (
    <div
      style={{
        transform: `rotate(${rotate}deg) scale(${pop})`,
        border: `5px solid ${color}`,
        borderRadius: 10,
        padding: "12px 26px",
        fontFamily: monoFont,
        fontWeight: 600,
        fontSize: 34,
        letterSpacing: 5,
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Cartão de dado: número grande com rótulo. */
export const StatCard: React.FC<{
  value: string;
  label: string;
  delay: number;
  onDark?: boolean;
  accent?: string;
}> = ({ value, label, delay, onDark, accent }) => {
  const pop = usePop(delay);
  return (
    <div
      style={{
        transform: `scale(${pop})`,
        backgroundColor: onDark ? "rgba(248,243,231,0.07)" : colors.areia,
        borderRadius: 18,
        padding: "30px 40px",
        minWidth: 300,
      }}
    >
      <div
        style={{
          fontFamily: headlineFont,
          fontWeight: 700,
          fontSize: 82,
          lineHeight: 1.1,
          color: accent ?? (onDark ? ink.onDark : ink.onLight),
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
      <div style={{ marginTop: 8 }}>
        <Label onDark={onDark} size={22}>
          {label}
        </Label>
      </div>
    </div>
  );
};

/** Rodapé de fonte, pra manter o padrão jornalístico em cena com dado. */
export const Source: React.FC<{ children: React.ReactNode; onDark?: boolean }> = ({
  children,
  onDark,
}) => (
  <div
    style={{
      position: "absolute",
      left: 96,
      bottom: 300,
      fontFamily: bodyFont,
      fontSize: 22,
      letterSpacing: 0.5,
      color: onDark ? muted.onDark : muted.onLight,
    }}
  >
    {children}
  </div>
);
