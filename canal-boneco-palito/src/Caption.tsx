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

  const translateY = (1 - enter) * 20;

  const parts = highlight ? text.split(highlight) : [text];

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 110,
        display: "flex",
        justifyContent: "center",
        opacity: enter,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: 1500,
          padding: "30px 56px",
          borderRadius: 18,
          backgroundColor: "rgba(43, 43, 43, 0.78)",
          boxShadow: "0 18px 48px rgba(0, 0, 0, 0.35)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 64,
            height: 4,
            borderRadius: 4,
            backgroundColor: colors.terracota,
          }}
        />
        <div
          style={{
            fontFamily: bodyFont,
            fontWeight: 600,
            fontSize: 44,
            lineHeight: 1.4,
            letterSpacing: 0.2,
            textAlign: "center",
            color: colors.marfim,
          }}
        >
          {parts.length === 2 ? (
            <>
              {parts[0]}
              <span style={{ color: colors.terracota, fontWeight: 700 }}>{highlight}</span>
              {parts[1]}
            </>
          ) : (
            text
          )}
        </div>
      </div>
    </div>
  );
};
