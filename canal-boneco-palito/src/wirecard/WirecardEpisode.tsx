import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, staticFile } from "remotion";
import { Caption } from "../Caption";
import { CAPTIONS, FPS, SCENES, TOTAL_FRAMES } from "./timings";
import {
  Aftermath,
  Closing,
  ColdOpen,
  CollapseStats,
  DaxMoment,
  Journalist,
  MissingMoney,
  MoneyFlow,
  NeverArrived,
  RegulatorTurns,
  RiseTimeline,
  SevenDays,
  SixteenMonths,
  SpecialAudit,
  StillMissing,
  TitleCard,
} from "./scenes";

type SceneName = (typeof SCENES)[number]["name"];

const SCENE_COMPONENTS: Record<SceneName, React.FC<{ durationInFrames: number }>> = {
  ColdOpen,
  MissingMoney,
  TitleCard,
  RiseTimeline,
  DaxMoment,
  MoneyFlow,
  Journalist,
  RegulatorTurns,
  SpecialAudit,
  SevenDays,
  CollapseStats,
  NeverArrived,
  StillMissing,
  SixteenMonths,
  Aftermath,
  Closing,
};

export const WirecardVideo = () => (
  <Composition
    id="ScandalFiles01Wirecard"
    component={WirecardEpisode}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={1920}
    height={1080}
  />
);

export const WirecardEpisode: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#2B2B2B" }}>
    <Audio src={staticFile("audio/wirecard-narration.wav")} />

    {SCENES.map((scene) => {
      const Component = SCENE_COMPONENTS[scene.name];
      return (
        <Sequence key={scene.name} from={scene.from} durationInFrames={scene.durationInFrames}>
          <Component durationInFrames={scene.durationInFrames} />
        </Sequence>
      );
    })}

    {CAPTIONS.map((c, i) => (
      <Sequence key={i} from={c.from} durationInFrames={c.durationInFrames}>
        <Caption text={c.text} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
