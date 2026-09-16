import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { colors } from "../theme";
import { headlineFont, bodyFont } from "../fonts";

// Regras de visualização aplicadas aqui (paleta do Brand Kit reprovou como
// paleta categórica — as cores terrosas são próximas demais para daltonismo),
// então: uma série por gráfico, rótulo direto sempre, terracota só como
// alerta, oliva só como crescimento, eixos discretos, texto em cor de texto.
const INK_DARK = colors.marfim;
const INK_LIGHT = colors.carvao;
const MUTED_ON_DARK = "rgba(248,243,231,0.55)";
const MUTED_ON_LIGHT = "rgba(43,43,43,0.55)";
const GRID_ON_LIGHT = colors.pedra;

const Kicker: React.FC<{ children: React.ReactNode; onDark?: boolean; opacity?: number }> = ({
  children,
  onDark,
  opacity = 1,
}) => (
  <div
    style={{
      fontFamily: bodyFont,
      fontWeight: 600,
      fontSize: 26,
      letterSpacing: 4,
      textTransform: "uppercase",
      color: onDark ? MUTED_ON_DARK : MUTED_ON_LIGHT,
      opacity,
    }}
  >
    {children}
  </div>
);

/** Beat 1 — número herói: o valor que sumiu. Forma "manchete única", não gráfico. */
export const HeroNumberScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const count = interpolate(frame, [8, 70], [0, 300000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const kickerIn = spring({ fps, frame: frame - 4, config: { damping: 200 } });
  const labelIn = interpolate(frame, [72, 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ruleWidth = interpolate(frame, [74, 96], [0, 420], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.carvao,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 18,
        paddingBottom: 120,
      }}
    >
      <div style={{ opacity: kickerIn }}>
        <Kicker onDark>Nortech · internal audit</Kicker>
      </div>
      <div
        style={{
          fontFamily: headlineFont,
          fontWeight: 700,
          fontSize: 210,
          lineHeight: 1.18,
          color: colors.terracota,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        ${Math.round(count).toLocaleString("en-US")}
      </div>
      <div
        style={{
          width: ruleWidth,
          height: 3,
          marginTop: 10,
          backgroundColor: colors.terracota,
          borderRadius: 3,
        }}
      />
      <div
        style={{
          fontFamily: bodyFont,
          fontWeight: 600,
          fontSize: 34,
          letterSpacing: 2,
          color: INK_DARK,
          opacity: labelIn,
        }}
      >
        gone from the company account
      </div>
    </AbsoluteFill>
  );
};

/** Beat 2 — barras: 8 meses de transferências crescentes. Série única. */
export const MonthlyBarsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const values = [18, 22, 27, 31, 38, 44, 55, 65];
  const maxValue = 70;
  const chartHeight = 420;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.carvao,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 40,
        paddingBottom: 150,
      }}
    >
      <Kicker onDark>Monthly transfers to an unknown vendor</Kicker>

      <div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 22,
            height: chartHeight,
            borderBottom: `2px solid ${MUTED_ON_DARK}`,
          }}
        >
          {values.map((v, i) => {
            const grow = interpolate(frame, [6 + i * 6, 26 + i * 6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            const isLast = i === values.length - 1;
            return (
              <div
                key={i}
                style={{
                  width: 74,
                  height: (v / maxValue) * chartHeight * grow,
                  backgroundColor: colors.terracota,
                  borderRadius: "6px 6px 0 0",
                  position: "relative",
                }}
              >
                {isLast && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "calc(100% + 14px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontFamily: bodyFont,
                      fontWeight: 700,
                      fontSize: 28,
                      color: INK_DARK,
                      opacity: interpolate(grow, [0.6, 1], [0, 1], { extrapolateLeft: "clamp" }),
                    }}
                  >
                    $65k
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 22, marginTop: 14 }}>
          {values.map((_, i) => (
            <div
              key={i}
              style={{
                width: 74,
                textAlign: "center",
                fontFamily: bodyFont,
                fontSize: 22,
                color: MUTED_ON_DARK,
              }}
            >
              M{i + 1}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          fontFamily: bodyFont,
          fontWeight: 600,
          fontSize: 30,
          color: INK_DARK,
          opacity: interpolate(frame, [54, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        8 months · nobody flagged a single one
      </div>
    </AbsoluteFill>
  );
};

/** Beats 3-5 — linha do tempo + curva de crescimento + métricas. Série única (oliva). */
export const GrowthScene: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Curva de crescimento 2015 -> 2025 (índice de receita, série única)
  const points = [3, 4, 6, 9, 14, 21, 30, 42, 56, 72, 88];
  const chartW = 1680;
  const chartH = 400;
  const maxY = 100;

  const draw = interpolate(frame, [startFrame, startFrame + 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const visibleCount = Math.max(2, Math.round(points.length * draw));
  const shown = points.slice(0, visibleCount);
  const coords = shown.map((v, i) => ({
    x: (i / (points.length - 1)) * chartW,
    y: chartH - (v / maxY) * chartH,
  }));
  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const areaPath = `${path} L ${coords[coords.length - 1].x} ${chartH} L 0 ${chartH} Z`;
  const head = coords[coords.length - 1];

  const stat = (delay: number) =>
    spring({ fps, frame: frame - delay, config: { damping: 14, stiffness: 140, mass: 0.6 } });

  const yearIn = spring({ fps, frame: frame - 6, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.marfim, padding: "90px 120px 220px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ opacity: yearIn }}>
          <Kicker>Nortech · revenue index</Kicker>
          <div
            style={{
              fontFamily: headlineFont,
              fontWeight: 700,
              fontSize: 76,
              color: INK_LIGHT,
              marginTop: 6,
            }}
          >
            2015 → 2025
          </div>
        </div>

        <div style={{ display: "flex", gap: 22 }}>
          {[
            { value: "40", label: "employees", delay: startFrame + 10 },
            { value: "8", label: "states", delay: startFrame + 24 },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                transform: `scale(${Math.max(stat(s.delay), 0)})`,
                backgroundColor: colors.areia,
                borderRadius: 16,
                padding: "22px 34px",
                minWidth: 190,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: headlineFont,
                  fontWeight: 700,
                  fontSize: 68,
                  color: INK_LIGHT,
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: bodyFont,
                  fontSize: 22,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: MUTED_ON_LIGHT,
                  marginTop: 6,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <svg width={chartW} height={chartH + 60} style={{ marginTop: 48, overflow: "visible" }}>
        {/* grade discreta */}
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <line
            key={g}
            x1={0}
            y1={chartH * g}
            x2={chartW}
            y2={chartH * g}
            stroke={GRID_ON_LIGHT}
            strokeWidth={1}
          />
        ))}
        <path d={areaPath} fill={colors.salvia} opacity={0.28} />
        <path d={path} fill="none" stroke={colors.oliva} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={head.x} cy={head.y} r={11} fill={colors.oliva} stroke={colors.marfim} strokeWidth={4} />
        {/* eixo x discreto */}
        <line x1={0} y1={chartH} x2={chartW} y2={chartH} stroke={INK_LIGHT} strokeWidth={2} />
        <text x={0} y={chartH + 42} fontFamily={bodyFont} fontSize={24} fill={MUTED_ON_LIGHT}>
          2015
        </text>
        <text x={chartW} y={chartH + 42} textAnchor="end" fontFamily={bodyFont} fontSize={24} fill={MUTED_ON_LIGHT}>
          2025
        </text>
        {/* rótulo direto (sem legenda: série única) */}
        <text
          x={head.x - 16}
          y={head.y - 28}
          textAnchor="end"
          fontFamily={bodyFont}
          fontWeight={700}
          fontSize={30}
          fill={INK_LIGHT}
          opacity={draw > 0.93 ? 1 : 0}
        >
          top 3 in the region
        </text>
      </svg>
    </AbsoluteFill>
  );
};

/** Beat 6 — o documento: e-mail que não deveria existir. */
export const DocumentScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const paperIn = spring({ fps, frame, config: { damping: 18, stiffness: 120, mass: 0.8 } });
  const highlight = interpolate(frame, [46, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stampIn = spring({ fps, frame: frame - 70, config: { damping: 11, stiffness: 160, mass: 0.6 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.carvao,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 150,
      }}
    >
      <div
        style={{
          transform: `scale(${Math.max(paperIn, 0)})`,
          width: 1080,
          backgroundColor: colors.marfim,
          borderRadius: 14,
          padding: "52px 60px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
        }}
      >
        <div style={{ fontFamily: bodyFont, fontSize: 24, letterSpacing: 3, color: MUTED_ON_LIGHT }}>
          SUBJECT
        </div>
        <div
          style={{
            fontFamily: headlineFont,
            fontWeight: 700,
            fontSize: 58,
            color: INK_LIGHT,
            marginTop: 6,
          }}
        >
          Acquisition proposal — confidential
        </div>

        <div style={{ height: 2, backgroundColor: GRID_ON_LIGHT, margin: "32px 0" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontFamily: bodyFont, fontSize: 26, letterSpacing: 2, color: MUTED_ON_LIGHT, width: 90 }}>
            TO
          </div>
          <div
            style={{
              position: "relative",
              fontFamily: bodyFont,
              fontWeight: 700,
              fontSize: 38,
              color: INK_LIGHT,
              padding: "6px 12px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: colors.terracota,
                opacity: 0.28 * highlight,
                transform: `scaleX(${highlight})`,
                transformOrigin: "left center",
                borderRadius: 6,
              }}
            />
            <span style={{ position: "relative" }}>richard@nortech.com</span>
          </div>
        </div>

        {[0.9, 0.75, 0.85, 0.6].map((w, i) => (
          <div
            key={i}
            style={{
              height: 16,
              width: `${w * 100}%`,
              backgroundColor: GRID_ON_LIGHT,
              borderRadius: 8,
              marginTop: i === 0 ? 34 : 18,
              opacity: 0.8,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          top: 120,
          right: 150,
          transform: `rotate(-8deg) scale(${Math.max(stampIn, 0)})`,
          border: `5px solid ${colors.terracota}`,
          borderRadius: 12,
          padding: "14px 30px",
          fontFamily: bodyFont,
          fontWeight: 700,
          fontSize: 38,
          letterSpacing: 4,
          color: colors.terracota,
        }}
      >
        NOT ADDRESSED TO THE CEO
      </div>
    </AbsoluteFill>
  );
};

/** Beat 7 — cartão de título / abertura da série. */
export const TitleCardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ fps, frame: frame - 4, config: { damping: 14, stiffness: 130, mass: 0.7 } });
  const subIn = interpolate(frame, [34, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rule = interpolate(frame, [26, 54], [0, 560], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.carvao,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 26,
        paddingBottom: 150,
      }}
    >
      <Kicker onDark opacity={subIn}>Business case · episode 01</Kicker>
      <div
        style={{
          fontFamily: headlineFont,
          fontWeight: 700,
          fontSize: 116,
          lineHeight: 1.25,
          textAlign: "center",
          color: colors.marfim,
          transform: `scale(${Math.max(titleIn, 0)})`,
        }}
      >
        Anatomy of a <span style={{ color: colors.terracota }}>$300K</span> betrayal
      </div>
      <div style={{ width: rule, height: 3, marginTop: 8, backgroundColor: colors.oliva, borderRadius: 3 }} />
      <div
        style={{
          fontFamily: bodyFont,
          fontSize: 34,
          color: colors.lavanda,
          opacity: subIn,
        }}
      >
        How a ten-year company almost died in one click
      </div>
    </AbsoluteFill>
  );
};
