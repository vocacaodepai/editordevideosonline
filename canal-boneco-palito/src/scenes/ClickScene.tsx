import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../theme";
import { Caption } from "../Caption";
import { bodyFont } from "../fonts";
import { CHARACTER } from "../characterStyle";

const CLICK_FRAME = 70;

type Props = {
  buttonLabel?: string;
  captionText?: string;
  captionHighlight?: string;
};

export const ClickScene: React.FC<Props> = ({
  buttonLabel = "ASSINAR CONTRATO",
  captionText = "Um clique, e a empresa inteira mudaria de dono.",
  captionHighlight = "Um clique",
}) => {
  const frame = useCurrentFrame();

  const zoom = interpolate(frame, [0, 120], [1, 1.12], {
    extrapolateRight: "clamp",
  });

  const pulse = interpolate(
    frame,
    [CLICK_FRAME - 6, CLICK_FRAME, CLICK_FRAME + 16],
    [1, 0.92, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const flash = interpolate(frame, [CLICK_FRAME, CLICK_FRAME + 4, CLICK_FRAME + 10], [0, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cursorX = interpolate(frame, [0, CLICK_FRAME], [-260, 40], {
    extrapolateRight: "clamp",
  });
  const cursorY = interpolate(frame, [0, CLICK_FRAME], [-180, 20], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.carvao }}>
      <AbsoluteFill
        style={{
          transform: `scale(${zoom})`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${pulse})`,
            width: 620,
            height: 150,
            borderRadius: 16,
            backgroundColor: colors.terracota,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          }}
        >
          <span
            style={{
              fontFamily: bodyFont,
              fontWeight: 600,
              fontSize: 46,
              letterSpacing: 2,
              color: colors.marfim,
            }}
          >
            {buttonLabel}
          </span>
        </div>

        {/* braço do personagem entrando em quadro para clicar */}
        <svg
          viewBox="0 0 1920 1080"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          <line
            x1={1920}
            y1={1080}
            x2={960 + cursorX}
            y2={540 + cursorY}
            stroke={CHARACTER.stroke}
            strokeWidth={CHARACTER.strokeWidth}
            strokeLinecap="round"
          />
        </svg>

        {/* cursor */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 0,
            height: 0,
            transform: `translate(-50%, -50%) translate(${cursorX}px, ${cursorY}px)`,
            borderLeft: "18px solid transparent",
            borderRight: "18px solid transparent",
            borderTop: `28px solid ${colors.marfim}`,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: colors.marfim, opacity: flash }} />

      <Caption text={captionText} highlight={captionHighlight} />
    </AbsoluteFill>
  );
};
