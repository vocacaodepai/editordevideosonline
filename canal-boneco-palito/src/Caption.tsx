import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "./theme";
import { bodyFont } from "./fonts";

export const Caption: React.FC<{ text: string; highlight?: string }> = ({
  text,
  highlight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    fps,
    frame,
    config: { damping: 200, stiffness: 220, mass: 0.6 },
  });

  const translateY = (1 - enter) * 24;

  const parts = highlight ? text.split(highlight) : [text];

  return (
    <div
      style={{
        position: "absolute",
        left: 100,
        right: 100,
        bottom: 130,
        display: "flex",
        justifyContent: "center",
        opacity: enter,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          fontFamily: bodyFont,
          fontWeight: 600,
          fontSize: 52,
          lineHeight: 1.25,
          textAlign: "center",
          color: colors.marfim,
          textShadow: "0 2px 18px rgba(0,0,0,0.55)",
          maxWidth: 1500,
        }}
      >
        {parts.length === 2 ? (
          <>
            {parts[0]}
            <span style={{ color: colors.terracota }}>{highlight}</span>
            {parts[1]}
          </>
        ) : (
          text
        )}
      </div>
    </div>
  );
};
