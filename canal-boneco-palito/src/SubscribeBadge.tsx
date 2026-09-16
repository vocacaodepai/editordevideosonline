import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors } from "./theme";
import { bodyFont } from "./fonts";

// CTA discreto e constante, pra lembrar de seguir o canal sem atrapalhar a
// legenda (que fica na parte de baixo da tela).
export const SubscribeBadge: React.FC<{ appearAt?: number; label?: string }> = ({
  appearAt = 45,
  label = "SEGUE O CANAL",
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [appearAt, appearAt + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulse = 0.9 + 0.1 * Math.sin((frame - appearAt) / 10);

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 60,
        opacity,
        transform: `scale(${pulse})`,
        display: "flex",
        alignItems: "center",
        gap: 14,
        backgroundColor: "rgba(43,43,43,0.55)",
        borderRadius: 999,
        padding: "14px 28px 14px 20px",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          backgroundColor: colors.terracota,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
        }}
      >
        🔔
      </div>
      <span
        style={{
          fontFamily: bodyFont,
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: 0.5,
          color: colors.marfim,
        }}
      >
        {label}
      </span>
    </div>
  );
};
