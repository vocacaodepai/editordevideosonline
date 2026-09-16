import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Caption } from "./Caption";
import { SET_BACKGROUNDS, SET_COMPONENTS } from "./SetIllustrations";

type CaptionLine = { text: string; highlight?: string };

export const ChapterScene: React.FC<{
  visual: keyof typeof SET_COMPONENTS;
  durationInFrames: number;
  lines: CaptionLine[];
}> = ({ visual, durationInFrames, lines }) => {
  const frame = useCurrentFrame();
  const Set = SET_COMPONENTS[visual];
  const bg = SET_BACKGROUNDS[visual];

  const segment = Math.floor(durationInFrames / lines.length);

  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <Set frame={frame} />
      {lines.map((line, i) => (
        <Sequence key={i} from={i * segment} durationInFrames={segment}>
          <Caption text={line.text} highlight={line.highlight} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
