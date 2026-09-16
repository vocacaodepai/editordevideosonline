import { Audio, Composition, Sequence, staticFile } from "remotion";
import { DeskScene } from "../scenes/DeskScene";
import { ClickScene } from "../scenes/ClickScene";
import { FaceScene } from "../scenes/FaceScene";
import { CliffhangerScene } from "../scenes/CliffhangerScene";
import { SubscribeBreakScene } from "../scenes/SubscribeBreakScene";
import { ChapterScene } from "../ChapterScene";
import { LINES } from "./lines";

const FPS = 30;

// Durações medidas dos áudios finais (Piper "ryan-high", length-scale 1.35).
const DUR = {
  cap1: 5465,
  cta: 565,
  cap2: 7514,
  cap3: 5384,
  cap4: 6703,
  cap5: 4772,
  cap6: 6217,
  cap7: 5862,
};

// Cap1 é dividido em 3 sub-cenas do gancho (já validadas) + 2 blocos de
// contexto (garagem / escritório), proporcionalmente ao texto de cada trecho.
const HOOK_LINES = LINES.cap1.slice(0, 8);
const GARAGE_LINES = LINES.cap1.slice(8, 39);
const OFFICE_LINES = LINES.cap1.slice(39);

const hookWords = HOOK_LINES.join(" ").split(" ").length;
const garageWords = GARAGE_LINES.join(" ").split(" ").length;
const officeWords = OFFICE_LINES.join(" ").split(" ").length;
const cap1TotalWords = hookWords + garageWords + officeWords;

const hookFrames = Math.round((hookWords / cap1TotalWords) * DUR.cap1);
const garageFrames = Math.round((garageWords / cap1TotalWords) * DUR.cap1);
const officeFrames = DUR.cap1 - hookFrames - garageFrames;

const deskFrames = Math.round(hookFrames / 3);
const clickFrames = Math.round(hookFrames / 3);
const faceFrames = hookFrames - deskFrames - clickFrames;

const CHAPTER_STARTS = (() => {
  const order: (keyof typeof DUR)[] = ["cap1", "cta", "cap2", "cap3", "cap4", "cap5", "cap6", "cap7"];
  const starts: Record<string, number> = {};
  let acc = 0;
  for (const key of order) {
    starts[key] = acc;
    acc += DUR[key];
  }
  return { starts, total: acc };
})();

export const TOTAL_DURATION = CHAPTER_STARTS.total;

export const StoryVideo = () => {
  return (
    <Composition
      id="DecisionThatChangedEverything"
      component={StoryVideoComponent}
      durationInFrames={TOTAL_DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};

const audio = (name: string) => staticFile(`audio/story/${name}.wav`);

export const StoryVideoComponent: React.FC = () => {
  const s = CHAPTER_STARTS.starts;

  return (
    <>
      {/* Trilha de narração: um Audio por capítulo, alinhado ao Sequence correspondente */}
      <Sequence from={s.cap1} durationInFrames={DUR.cap1}>
        <Audio src={audio("cap1")} />
      </Sequence>
      <Sequence from={s.cta} durationInFrames={DUR.cta}>
        <Audio src={audio("cta")} />
      </Sequence>
      <Sequence from={s.cap2} durationInFrames={DUR.cap2}>
        <Audio src={audio("cap2")} />
      </Sequence>
      <Sequence from={s.cap3} durationInFrames={DUR.cap3}>
        <Audio src={audio("cap3")} />
      </Sequence>
      <Sequence from={s.cap4} durationInFrames={DUR.cap4}>
        <Audio src={audio("cap4")} />
      </Sequence>
      <Sequence from={s.cap5} durationInFrames={DUR.cap5}>
        <Audio src={audio("cap5")} />
      </Sequence>
      <Sequence from={s.cap6} durationInFrames={DUR.cap6}>
        <Audio src={audio("cap6")} />
      </Sequence>
      <Sequence from={s.cap7} durationInFrames={DUR.cap7}>
        <Audio src={audio("cap7")} />
      </Sequence>

      {/* Capítulo 1 — gancho (Desk/Click/Face já validados) + origem da empresa */}
      <Sequence from={s.cap1} durationInFrames={deskFrames}>
        <DeskScene
          captionText="Thirty seconds were left before the meeting started."
          captionHighlight="Thirty seconds"
        />
      </Sequence>
      <Sequence from={s.cap1 + deskFrames} durationInFrames={clickFrames}>
        <ClickScene
          buttonLabel="SIGN CONTRACT"
          captionText="One click, and the entire company would change hands."
          captionHighlight="One click"
        />
      </Sequence>
      <Sequence from={s.cap1 + deskFrames + clickFrames} durationInFrames={faceFrames}>
        <FaceScene
          captionText="He was about to make the most expensive decision of his life."
          captionHighlight="most expensive decision"
        />
      </Sequence>
      <Sequence from={s.cap1 + hookFrames} durationInFrames={garageFrames}>
        <ChapterScene
          visual="garage"
          durationInFrames={garageFrames}
          lines={GARAGE_LINES.map((text) => ({ text }))}
        />
      </Sequence>
      <Sequence from={s.cap1 + hookFrames + garageFrames} durationInFrames={officeFrames}>
        <ChapterScene
          visual="office"
          durationInFrames={officeFrames}
          lines={OFFICE_LINES.map((text) => ({ text }))}
        />
      </Sequence>

      {/* CTA único — boas-vindas e convite pra seguir o canal */}
      <Sequence from={s.cta} durationInFrames={DUR.cta}>
        <SubscribeBreakScene
          durationInFrames={DUR.cta}
          captionText="Welcome! Hit subscribe if you want more stories like this one."
        />
      </Sequence>

      {/* Capítulo 2 — as rachaduras / a descoberta */}
      <Sequence from={s.cap2} durationInFrames={DUR.cap2}>
        <ChapterScene visual="discovery" durationInFrames={DUR.cap2} lines={LINES.cap2.map((text) => ({ text }))} />
      </Sequence>

      {/* Capítulo 3 — o confronto */}
      <Sequence from={s.cap3} durationInFrames={DUR.cap3}>
        <ChapterScene
          visual="confrontation"
          durationInFrames={DUR.cap3}
          lines={LINES.cap3.map((text) => ({ text }))}
        />
      </Sequence>

      {/* Capítulo 4 — seguindo o dinheiro */}
      <Sequence from={s.cap4} durationInFrames={DUR.cap4}>
        <ChapterScene
          visual="investigation"
          durationInFrames={DUR.cap4}
          lines={LINES.cap4.map((text) => ({ text }))}
        />
      </Sequence>

      {/* Capítulo 5 — a escolha difícil */}
      <Sequence from={s.cap5} durationInFrames={DUR.cap5}>
        <ChapterScene visual="decision" durationInFrames={DUR.cap5} lines={LINES.cap5.map((text) => ({ text }))} />
      </Sequence>

      {/* Capítulo 6 — a virada */}
      <Sequence from={s.cap6} durationInFrames={DUR.cap6}>
        <ChapterScene visual="climax" durationInFrames={DUR.cap6} lines={LINES.cap6.map((text) => ({ text }))} />
      </Sequence>

      {/* Capítulo 7 — depois do clique + encerramento */}
      <Sequence from={s.cap7} durationInFrames={DUR.cap7 - 300}>
        <ChapterScene
          visual="resolution"
          durationInFrames={DUR.cap7 - 300}
          lines={LINES.cap7.map((text) => ({ text }))}
        />
      </Sequence>
      <Sequence from={s.cap7 + DUR.cap7 - 300} durationInFrames={300}>
        <CliffhangerScene
          title="What would you do?"
          subtitle="New story every week."
          ctaLabel="FOLLOW TO SEE THE NEXT ONE"
          shareLabel="📤 Tag someone who'd do the same."
        />
      </Sequence>
    </>
  );
};
