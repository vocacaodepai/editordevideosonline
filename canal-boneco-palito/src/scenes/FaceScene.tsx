import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../theme";
import { Caption } from "../Caption";

type Props = {
  captionText?: string;
  captionHighlight?: string;
};

export const FaceScene: React.FC<Props> = ({
  captionText = "Ele ainda não sabia que essa seria a decisão mais cara da sua vida.",
  captionHighlight = "decisão mais cara",
}) => {
  const frame = useCurrentFrame();
  const durationFrames = 200;

  const zoom = interpolate(frame, [0, durationFrames], [1, 1.18], {
    extrapolateRight: "clamp",
  });

  const vignette = interpolate(frame, [0, durationFrames], [0.15, 0.55], {
    extrapolateRight: "clamp",
  });

  const blink = frame % 90 < 4;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.pedra }}>
      <AbsoluteFill
        style={{
          transform: `scale(${zoom})`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={420} height={420} viewBox="0 0 420 420" style={{ overflow: "visible" }}>
          <circle
            cx={210}
            cy={210}
            r={150}
            fill="none"
            stroke={colors.carvao}
            strokeWidth={14}
          />
          {/* olhos */}
          <circle cx={160} cy={190} r={blink ? 1 : 9} fill={colors.carvao} />
          <circle cx={260} cy={190} r={blink ? 1 : 9} fill={colors.carvao} />
          {/* boca tensa */}
          <line
            x1={168}
            y1={255}
            x2={252}
            y2={255}
            stroke={colors.carvao}
            strokeWidth={9}
            strokeLinecap="round"
          />
        </svg>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: `radial-gradient(circle, rgba(0,0,0,0) 35%, rgba(43,43,43,${vignette}) 100%)`,
        }}
      />

      <Caption text={captionText} highlight={captionHighlight} />
    </AbsoluteFill>
  );
};
