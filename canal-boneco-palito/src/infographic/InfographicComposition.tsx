import { Audio, Composition, Sequence, staticFile } from "remotion";
import { Caption } from "../Caption";
import { CAPTIONS, FPS, TOTAL_FRAMES } from "./timings";
import {
  HeroNumberScene,
  MonthlyBarsScene,
  GrowthScene,
  DocumentScene,
  TitleCardScene,
} from "./DataScenes";

// Os cortes de cena caem exatamente no início de cada frase narrada
// (CAPTIONS[i].from), porque cada frase virou um arquivo de áudio próprio.
const BEAT = CAPTIONS.map((c) => c.from);

export const InfographicVideo = () => (
  <Composition
    id="BusinessCaseIntro"
    component={InfographicVideoComponent}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={1920}
    height={1080}
  />
);

export const InfographicVideoComponent: React.FC = () => {
  return (
    <>
      <Audio src={staticFile("audio/infographic/narration.wav")} />

      <Sequence from={0} durationInFrames={BEAT[1]}>
        <HeroNumberScene />
      </Sequence>

      <Sequence from={BEAT[1]} durationInFrames={BEAT[2] - BEAT[1]}>
        <MonthlyBarsScene />
      </Sequence>

      <Sequence from={BEAT[2]} durationInFrames={BEAT[5] - BEAT[2]}>
        <GrowthScene startFrame={BEAT[3] - BEAT[2]} />
      </Sequence>

      <Sequence from={BEAT[5]} durationInFrames={BEAT[6] - BEAT[5]}>
        <DocumentScene />
      </Sequence>

      <Sequence from={BEAT[6]} durationInFrames={TOTAL_FRAMES - BEAT[6]}>
        <TitleCardScene />
      </Sequence>

      {CAPTIONS.map((c, i) => (
        <Sequence key={i} from={c.from} durationInFrames={c.durationInFrames}>
          <Caption text={c.text} />
        </Sequence>
      ))}
    </>
  );
};
