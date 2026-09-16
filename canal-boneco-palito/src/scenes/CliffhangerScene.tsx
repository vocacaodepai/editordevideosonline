import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";
import { headlineFont, bodyFont } from "../fonts";

export const CliffhangerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flash = interpolate(frame, [0, 3, 9], [1, 1, 0], {
    extrapolateRight: "clamp",
  });

  const titleScale = spring({
    fps,
    frame: frame - 6,
    config: { damping: 12, stiffness: 140, mass: 0.7 },
  });

  const subtitleOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctaScale = spring({
    fps,
    frame: frame - 70,
    config: { damping: 11, stiffness: 160, mass: 0.6 },
  });

  const shareOpacity = interpolate(frame, [110, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const linePulse = 0.5 + 0.5 * Math.sin(frame / 12);
  const ctaPulse = 1 + 0.04 * Math.sin(frame / 8);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.carvao }}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div
          style={{
            fontFamily: headlineFont,
            fontWeight: 700,
            fontSize: 108,
            color: colors.marfim,
            textAlign: "center",
            transform: `scale(${Math.max(titleScale, 0)})`,
          }}
        >
          O que você faria?
        </div>

        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 400,
            fontSize: 40,
            color: colors.lavanda,
            opacity: subtitleOpacity,
            letterSpacing: 1,
          }}
        >
          Nova história toda semana.
        </div>

        <div
          style={{
            marginTop: 6,
            display: "flex",
            alignItems: "center",
            gap: 16,
            backgroundColor: colors.terracota,
            borderRadius: 999,
            padding: "20px 44px",
            transform: `scale(${Math.max(ctaScale, 0) * ctaPulse})`,
          }}
        >
          <span style={{ fontSize: 34 }}>🔔</span>
          <span
            style={{
              fontFamily: bodyFont,
              fontWeight: 700,
              fontSize: 34,
              letterSpacing: 1,
              color: colors.marfim,
            }}
          >
            SEGUE PARA SABER O FINAL
          </span>
        </div>

        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 400,
            fontSize: 30,
            color: colors.marfim,
            opacity: shareOpacity,
            letterSpacing: 0.5,
          }}
        >
          📤 Marca alguém que faria igual.
        </div>

        <div
          style={{
            marginTop: 6,
            width: 220,
            height: 4,
            backgroundColor: colors.oliva,
            opacity: 0.4 + linePulse * 0.6,
            borderRadius: 4,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: colors.marfim, opacity: flash }} />
    </AbsoluteFill>
  );
};
