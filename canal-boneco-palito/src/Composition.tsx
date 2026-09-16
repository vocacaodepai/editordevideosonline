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
      <Audio src={staticFile("audio/hook-narracao-piper.wav")} startFrom={0} volume={1} />

      <Sequence from={0} durationInFrames={100}>
        <DeskScene />
      </Sequence>

      <Sequence from={90} durationInFrames={120}>
        <ClickScene />
      </Sequence>

      <Sequence from={200} durationInFrames={190}>
        <FaceScene />
      </Sequence>

      <Sequence from={390} durationInFrames={DURATION_IN_FRAMES - 390}>
        <CliffhangerScene />
      </Sequence>

      {/* CTA fixo (segue o canal), visível durante o hook narrado */}
      <Sequence from={0} durationInFrames={390}>
        <SubscribeBadge appearAt={45} />
      </Sequence>
    </>
  );
};
