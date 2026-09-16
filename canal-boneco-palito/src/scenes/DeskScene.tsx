import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../theme";
import { StickFigure } from "../StickFigure";
import { Caption } from "../Caption";

export const DeskScene: React.FC = () => {
  const frame = useCurrentFrame();

  const zoom = interpolate(frame, [0, 100], [1, 1.08], {
    extrapolateRight: "clamp",
  });

  const clockAngle = interpolate(frame, [0, 100], [0, 360 * 1.5]);

  const armBob = Math.sin(frame / 5) * 6;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.marfim }}>
      <AbsoluteFill
        style={{
          transform: `scale(${zoom})`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* mesa */}
        <div
          style={{
            position: "absolute",
            bottom: 330,
            left: "50%",
            transform: "translateX(-50%)",
            width: 520,
            height: 14,
            backgroundColor: colors.cacau,
            borderRadius: 6,
          }}
        />
        {/* laptop */}
        <div
          style={{
            position: "absolute",
            bottom: 344,
            left: "50%",
            transform: "translateX(-50%)",
            width: 220,
            height: 130,
            backgroundColor: colors.carvao,
            borderRadius: "6px 6px 0 0",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 300,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <StickFigure
            armLeftAngle={70 + armBob}
            armRightAngle={70 - armBob}
            legLeftAngle={12}
            legRightAngle={-8}
          />
        </div>

        {/* relogio */}
        <div
          style={{
            position: "absolute",
            top: 140,
            right: 260,
            width: 90,
            height: 90,
            borderRadius: "50%",
            border: `6px solid ${colors.carvao}`,
            backgroundColor: colors.marfim,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 3,
              height: 32,
              backgroundColor: colors.terracota,
              transformOrigin: "bottom center",
              transform: `translate(-50%, -100%) rotate(${clockAngle}deg)`,
            }}
          />
        </div>
      </AbsoluteFill>

      <Caption text="Faltavam trinta segundos para a reunião começar." highlight="trinta segundos" />
    </AbsoluteFill>
  );
};
