import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";
import { bodyFont } from "../fonts";

/**
 * Legenda do episódio: entra deslizando e sai deslizando, sempre.
 * Como cada frase é um arquivo de áudio próprio, o início e o fim batem
 * exatos, e o movimento garante que a tela nunca fica estática entre
 * uma frase e a próxima.
 */
export const EpisodeCaption: React.FC<{ text: string; durationInFrames: number }> = ({
  text,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    fps,
    frame,
    config: { damping: 22, stiffness: 190, mass: 0.6 },
  });

  const exit = interpolate(frame, [durationInFrames - 9, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const y = (1 - enter) * 34 + exit * 26;
  const opacity = Math.max(enter, 0) * (1 - exit);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 104,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: 1480,
          padding: "28px 54px",
          borderRadius: 16,
          backgroundColor: "rgba(22,22,22,0.82)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.42)",
          backdropFilter: "blur(7px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 5,
            borderRadius: "16px 0 0 16px",
            backgroundColor: colors.terracota,
            transform: `scaleY(${Math.max(enter, 0)})`,
            transformOrigin: "top",
          }}
        />
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 600,
            fontSize: 42,
            lineHeight: 1.38,
            letterSpacing: 0.2,
            textAlign: "center",
            color: colors.marfim,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};
