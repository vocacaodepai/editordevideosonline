import { Audio, Composition, Sequence, staticFile } from "remotion";
import { DeskScene } from "./scenes/DeskScene";
import { ClickScene } from "./scenes/ClickScene";
import { FaceScene } from "./scenes/FaceScene";
import { CliffhangerScene } from "./scenes/CliffhangerScene";
import { SubscribeBadge } from "./SubscribeBadge";

const FPS = 30;
const DURATION_IN_FRAMES = FPS * 20;

export const MyComposition = () => {
  return (
    <Composition
      id="HookTeste20s"
      component={StickmanHook}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};

export const StickmanHook: React.FC = () => {
  return (
    <>
      <Audio src={staticFile("audio/hook-narracao-faber.wav")} startFrom={0} volume={1} />

      <Sequence from={0} durationInFrames={90}>
        <DeskScene />
      </Sequence>

      <Sequence from={80} durationInFrames={110}>
        <ClickScene />
      </Sequence>

      <Sequence from={180} durationInFrames={170}>
        <FaceScene />
      </Sequence>

      <Sequence from={340} durationInFrames={DURATION_IN_FRAMES - 340}>
        <CliffhangerScene />
      </Sequence>

      {/* CTA fixo (segue o canal), visível durante o hook narrado */}
      <Sequence from={0} durationInFrames={340}>
        <SubscribeBadge appearAt={45} />
      </Sequence>
    </>
  );
};
