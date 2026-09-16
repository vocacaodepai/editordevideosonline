import { Audio, Composition, Sequence, staticFile } from "remotion";
import { DeskScene } from "./scenes/DeskScene";
import { ClickScene } from "./scenes/ClickScene";
import { FaceScene } from "./scenes/FaceScene";
import { CliffhangerScene } from "./scenes/CliffhangerScene";
import { SubscribeBadge } from "./SubscribeBadge";

const FPS = 30;
const DURATION_IN_FRAMES = FPS * 20;

type HookText = {
  audioSrc: string;
  deskCaption: string;
  deskHighlight: string;
  buttonLabel: string;
  clickCaption: string;
  clickHighlight: string;
  faceCaption: string;
  faceHighlight: string;
  subscribeLabel: string;
  cliffhangerTitle: string;
  cliffhangerSubtitle: string;
  ctaLabel: string;
  shareLabel: string;
};

const PT_BR: HookText = {
  audioSrc: "audio/hook-narracao-faber.wav",
  deskCaption: "Faltavam trinta segundos para a reunião começar.",
  deskHighlight: "trinta segundos",
  buttonLabel: "ASSINAR CONTRATO",
  clickCaption: "Um clique, e a empresa inteira mudaria de dono.",
  clickHighlight: "Um clique",
  faceCaption: "Ele ainda não sabia que essa seria a decisão mais cara da sua vida.",
  faceHighlight: "decisão mais cara",
  subscribeLabel: "SEGUE O CANAL",
  cliffhangerTitle: "O que você faria?",
  cliffhangerSubtitle: "Nova história toda semana.",
  ctaLabel: "SEGUE PARA SABER O FINAL",
  shareLabel: "📤 Marca alguém que faria igual.",
};

const EN_US: HookText = {
  audioSrc: "audio/hook-narracao-ryan-en.wav",
  deskCaption: "Thirty seconds were left before the meeting started.",
  deskHighlight: "Thirty seconds",
  buttonLabel: "SIGN CONTRACT",
  clickCaption: "One click, and the entire company would change hands.",
  clickHighlight: "One click",
  faceCaption: "He did not know it yet, but this was the most expensive decision of his life.",
  faceHighlight: "most expensive decision",
  subscribeLabel: "FOLLOW THE CHANNEL",
  cliffhangerTitle: "What would you do?",
  cliffhangerSubtitle: "New story every week.",
  ctaLabel: "FOLLOW TO SEE THE END",
  shareLabel: "📤 Tag someone who'd do the same.",
};

export const MyComposition = () => {
  return (
    <>
      <Composition
        id="HookTeste20s"
        component={StickmanHook}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ text: PT_BR }}
      />
      <Composition
        id="HookTeste20sEN"
        component={StickmanHook}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ text: EN_US }}
      />
    </>
  );
};

export const StickmanHook: React.FC<{ text: HookText }> = ({ text }) => {
  return (
    <>
      <Audio src={staticFile(text.audioSrc)} startFrom={0} volume={1} />

      <Sequence from={0} durationInFrames={90}>
        <DeskScene captionText={text.deskCaption} captionHighlight={text.deskHighlight} />
      </Sequence>

      <Sequence from={80} durationInFrames={110}>
        <ClickScene
          buttonLabel={text.buttonLabel}
          captionText={text.clickCaption}
          captionHighlight={text.clickHighlight}
        />
      </Sequence>

      <Sequence from={180} durationInFrames={170}>
        <FaceScene captionText={text.faceCaption} captionHighlight={text.faceHighlight} />
      </Sequence>

      <Sequence from={340} durationInFrames={DURATION_IN_FRAMES - 340}>
        <CliffhangerScene
          title={text.cliffhangerTitle}
          subtitle={text.cliffhangerSubtitle}
          ctaLabel={text.ctaLabel}
          shareLabel={text.shareLabel}
        />
      </Sequence>

      {/* CTA fixo (segue o canal), visível durante o hook narrado */}
      <Sequence from={0} durationInFrames={340}>
        <SubscribeBadge appearAt={45} label={text.subscribeLabel} />
      </Sequence>
    </>
  );
};
