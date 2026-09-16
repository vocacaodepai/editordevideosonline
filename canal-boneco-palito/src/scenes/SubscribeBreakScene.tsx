import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";
import { headlineFont, bodyFont } from "../fonts";
import { Caption } from "../Caption";

// Único momento de CTA do vídeo inteiro: o narrador dá boas-vindas e
// pede pra seguir o canal, com um elemento gráfico dedicado, e depois
// a história volta ao fluxo normal.
export const SubscribeBreakScene: React.FC<{ durationInFrames: number; captionText: string }> = ({
  captionText,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bellScale = spring({
    fps,
    frame,
    config: { damping: 12, stiffness: 150, mass: 0.7 },
  });

  const pulse = 1 + 0.05 * Math.sin(frame / 8);

  const fade = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.carvao }}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 24,
          opacity: fade,
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            backgroundColor: colors.terracota,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 72,
            transform: `scale(${Math.max(bellScale, 0) * pulse})`,
          }}
        >
          🔔
        </div>
        <div
          style={{
            fontFamily: headlineFont,
            fontWeight: 700,
            fontSize: 64,
            color: colors.marfim,
          }}
        >
          Welcome to the channel
        </div>
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 400,
            fontSize: 32,
            color: colors.lavanda,
          }}
        >
          Like &amp; subscribe to catch the next one
        </div>
      </AbsoluteFill>

      <Caption text={captionText} />
    </AbsoluteFill>
  );
};
