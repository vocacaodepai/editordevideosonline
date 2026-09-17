import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, staticFile } from "remotion";
import { LINES, FPS, TOTAL_FRAMES } from "./timings";
import { EpisodeCaption } from "./EpisodeCaption";
import {
  B1,
  B2,
  B3,
  B4,
  B5,
  B6,
  B7,
  B8,
  B9,
  B10,
  B11,
  B12,
  B13,
  B14,
  B15,
  B16,
  B17,
  B18,
  B19,
  B20,
  B21,
  Credits,
} from "./episodeBoards";

/**
 * Scandal Files 01 · Wirecard.
 *
 * O episódio é uma sequência de quadros. Cada quadro cobre um bloco de frases
 * e monta um diagrama camada por camada, na batida da narração. O intervalo de
 * frases de cada quadro está declarado aqui e dentro do próprio quadro; os
 * dois precisam bater, e o teste abaixo (checkBoards) garante isso no build.
 */

type BoardEntry = { lines: [number, number]; C: React.FC };

const BOARDS: BoardEntry[] = [
  { lines: [1, 5], C: B1 },
  { lines: [6, 9], C: B2 },
  { lines: [10, 16], C: B3 },
  { lines: [17, 25], C: B4 },
  { lines: [26, 32], C: B5 },
  { lines: [33, 37], C: B6 },
  { lines: [38, 44], C: B7 },
  { lines: [45, 50], C: B8 },
  { lines: [51, 54], C: B9 },
  { lines: [55, 61], C: B10 },
  { lines: [62, 67], C: B11 },
  { lines: [68, 76], C: B12 },
  { lines: [77, 82], C: B13 },
  { lines: [83, 87], C: B14 },
  { lines: [88, 91], C: B15 },
  { lines: [92, 95], C: B16 },
  { lines: [96, 99], C: B17 },
  { lines: [100, 104], C: B18 },
  { lines: [105, 109], C: B19 },
  { lines: [110, 117], C: B20 },
  { lines: [118, 120], C: B21 },
];

/** Nenhuma frase pode ficar sem quadro, e nenhum quadro pode se sobrepor. */
const checkBoards = () => {
  let expected = 1;
  for (const b of BOARDS) {
    if (b.lines[0] !== expected) {
      throw new Error(`Quadro começa na frase ${b.lines[0]}, esperado ${expected}`);
    }
    expected = b.lines[1] + 1;
  }
  if (expected !== LINES.length + 1) {
    throw new Error(`Os quadros cobrem até a frase ${expected - 1} de ${LINES.length}`);
  }
};
checkBoards();

const CREDITS = [
  "Wirecard HQ, Aschheim · Kaethe17 · CC BY-SA 4.0",
  "BaFin building · Thomas Wolf · CC0",
  "Frankfurt Stock Exchange · Ank Kumar · CC BY-SA 4.0",
  "Justizpalast Munich · Martin Falbisoner · CC BY-SA 3.0",
  "Manila skyline · Vyacheslav Argenberg · CC BY 4.0",
  "Munich · Mike is Michi · CC BY-SA 4.0",
  "Wirecard wordmark · public domain",
];

export const WirecardEpisode: React.FC = () => {
  const lastLine = LINES[LINES.length - 1];
  const boardsEnd = lastLine.from + lastLine.durationInFrames;
  const creditsLength = Math.max(TOTAL_FRAMES - boardsEnd, 1);

  return (
    <AbsoluteFill style={{ backgroundColor: "#1C1C1C" }}>
      <Audio src={staticFile("audio/wirecard-narration.wav")} />

      {BOARDS.map(({ lines, C }, i) => {
        const first = LINES[lines[0] - 1];
        const last = LINES[lines[1] - 1];
        const from = first.from;
        const duration = last.from + last.durationInFrames - from;
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            <C />
          </Sequence>
        );
      })}

      <Sequence from={boardsEnd} durationInFrames={creditsLength}>
        <Credits duration={creditsLength} lines={CREDITS} />
      </Sequence>

      {LINES.map((line, i) => (
        <Sequence key={`c${i}`} from={line.from} durationInFrames={line.durationInFrames}>
          <EpisodeCaption text={line.text} durationInFrames={line.durationInFrames} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
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
