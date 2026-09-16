import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, staticFile } from "remotion";
import { colors } from "../theme";
import { EpisodeCaption } from "./EpisodeCaption";
import { LINES, FPS, TOTAL_FRAMES } from "./timings";
import {
  ShotBars,
  ShotCards,
  ShotCollapse,
  ShotCredits,
  ShotFlow,
  ShotGrid,
  ShotList,
  ShotNumber,
  ShotPhoto,
  ShotStatement,
  ShotStats,
  ShotTimeline,
  ShotTitle,
  ShotWanted,
} from "./shots";

/**
 * O episódio é uma sequência de planos curtos, não de cenas longas.
 * Cada plano cobre uma ou duas frases da narração (de 4 a 12 segundos),
 * tem entrada escalonada dos elementos, movimento contínuo de câmera e
 * saída. A legenda entra e sai a cada frase.
 */
type Shot = {
  lines: [number, number];
  render: (d: number) => React.ReactNode;
};

const SHOTS: Shot[] = [
  { lines: [1, 2], render: (d) => (
    <ShotPhoto duration={d} photo="hq.jpg" seed="hq"
      kicker="Aschheim, Germany · 18 June 2020"
      title="The report nobody would sign" />
  )},
  { lines: [3, 4], render: (d) => (
    <ShotNumber duration={d} value="€1.9 billion" countTo={1.9} prefix="€" suffix=" billion"
      kicker="Cash the auditors could not confirm"
      label="missing from the balance sheet" />
  )},
  { lines: [5, 5], render: (d) => (
    <ShotStatement duration={d} text="Not misplaced. Not frozen. Missing." accent="Missing." />
  )},
  { lines: [6, 6], render: (d) => <ShotGrid duration={d} /> },
  { lines: [7, 7], render: (d) => (
    <ShotStatement duration={d} text="It had probably never existed at all." accent="never existed" />
  )},
  { lines: [8, 9], render: (d) => <ShotTitle duration={d} /> },

  { lines: [10, 11], render: (d) => (
    <ShotPhoto duration={d} photo="munich.jpg" seed="mu"
      kicker="1999 · a suburb of Munich" title="It started as a middleman" />
  )},
  { lines: [12, 13], render: (d) => (
    <ShotList duration={d} dark marker="dot" kicker="The business" title="What Wirecard actually did"
      items={["Processed online card payments", "Took a small cut of each transaction", "Enormous volume, almost invisible"]} />
  )},
  { lines: [14, 16], render: (d) => (
    <ShotTimeline duration={d} kicker="Company timeline" title="From the suburbs to the index"
      marks={[
        { label: "1999", note: "founded near Munich" },
        { label: "2005", note: "listed in Frankfurt" },
        { label: "2014", note: "expansion across Asia" },
        { label: "2018", note: "enters the DAX", accent: true },
      ]} />
  )},
  { lines: [17, 19], render: (d) => (
    <ShotCards duration={d} kicker="24 September 2018" title="A seat changes hands"
      cards={[
        { tag: "In", title: "Wirecard AG", body: "A payments firm nineteen years old." },
        { tag: "Out", title: "Commerzbank", body: "A bank founded in 1870, moved down to the MDAX." },
      ]} />
  )},
  { lines: [20, 21], render: (d) => (
    <ShotBars duration={d} kicker="Market capitalisation · September 2018"
      title="Bigger than the country's largest bank" max={27}
      bars={[
        { name: "Wirecard", value: 24.6, display: "€24.6bn", accent: true },
        { name: "Deutsche Bank", value: 20.5, display: "€20.5bn" },
      ]} />
  )},
  { lines: [22, 23], render: (d) => (
    <ShotStatement duration={d} photo="boerse.jpg" kicker="Frankfurt"
      text="The German answer to Silicon Valley" />
  )},
  { lines: [24, 25], render: (d) => (
    <ShotStatement duration={d} text="Nobody looks closely at a national success story."
      accent="national success story" />
  )},

  { lines: [26, 26], render: (d) => (
    <ShotStatement duration={d} text="Now, the part that actually broke." />
  )},
  { lines: [27, 29], render: (d) => (
    <ShotList duration={d} dark marker="dot" kicker="Third party acquiring" title="How it was supposed to work"
      items={[
        "Local partners processed payments where Wirecard had no licence",
        "Wirecard booked those partners' profits as its own",
        "The partners sat outside anyone else's reach",
      ]} />
  )},
  { lines: [30, 32], render: (d) => <ShotFlow duration={d} /> },
  { lines: [33, 35], render: (d) => (
    <ShotStats duration={d} kicker="Why this mattered" title="The part nobody could see"
      stats={[
        { value: "Majority", label: "of reported profit", accent: true },
        { value: "€1.9bn", label: "held abroad" },
        { value: "10,000 km", label: "from head office" },
      ]} />
  )},
  { lines: [36, 37], render: (d) => (
    <ShotStatement duration={d} text="The documents proving it were forgeries." accent="forgeries" />
  )},

  { lines: [38, 39], render: (d) => (
    <ShotStatement duration={d} kicker="Singapore · Wirecard legal department"
      text="A lawyer started asking questions." />
  )},
  { lines: [40, 42], render: (d) => (
    <ShotList duration={d} marker="cross" kicker="What he found" title="Inside the Singapore office"
      items={["Manipulated accounts", "Fictitious transactions", "An internal investigation shut down"]} />
  )},
  { lines: [43, 44], render: (d) => (
    <ShotCards duration={d} kicker="The reporting" title="The documents reach a newsroom"
      cards={[
        { tag: "Financial Times", title: "Dan McCrum", body: "Had been examining Wirecard's accounting for years." },
        { tag: "From 2019", title: "The FT publishes", body: "A series of reports on the Asian operations." },
      ]} />
  )},
  { lines: [45, 46], render: (d) => (
    <ShotStatement duration={d} kicker="February 2019"
      text="Singapore police raid the offices." accent="police raid" />
  )},
  { lines: [47, 50], render: (d) => (
    <ShotList duration={d} dark marker="cross" kicker="What followed in Singapore" title="Charges, and one man missing"
      items={[
        "Prosecutors brought charges connected to the case",
        "A businessman was sentenced to twelve months in jail",
        "The named architect of the Asian accounting was never caught",
        "Interpol red notice · still at large",
      ]} />
  )},

  { lines: [51, 52], render: (d) => (
    <ShotStatement duration={d} text="This is the part that should worry you." accent="worry you" />
  )},
  { lines: [53, 53], render: (d) => (
    <ShotStatement duration={d} kicker="The company's answer"
      text="It blamed short sellers and journalists." />
  )},
  { lines: [54, 55], render: (d) => (
    <ShotPhoto duration={d} photo="bafin.jpg" seed="bf"
      kicker="BaFin · Germany's financial regulator" title="The regulator took the company's side" />
  )},
  { lines: [56, 57], render: (d) => (
    <ShotCards duration={d} kicker="February 2019" title="Decision one"
      cards={[{ tag: "Short selling banned", title: "Two months", body: "The first time the regulator had ever shielded a single listed company this way." }]} />
  )},
  { lines: [58, 59], render: (d) => (
    <ShotCards duration={d} kicker="February 2019" title="Decision two"
      cards={[{ tag: "Criminal complaints filed", title: "Against the reporters", body: "The journalists investigating the company's accounts." }]} />
  )},
  { lines: [60, 61], render: (d) => (
    <ShotStatement duration={d} text="Questioning Wirecard was now the suspicious activity."
      accent="the suspicious activity" />
  )},

  { lines: [62, 63], render: (d) => (
    <ShotStatement duration={d} dark={false} kicker="KPMG · special audit"
      text="An audit hired to prove the newspaper wrong." />
  )},
  { lines: [64, 66], render: (d) => (
    <ShotList duration={d} marker="cross" kicker="April 2020" title="What the report actually said"
      items={["Could not verify the third party business", "Weaknesses in record keeping", "New questions nobody had asked"]} />
  )},
  { lines: [67, 67], render: (d) => (
    <ShotStatement duration={d} text="It extended the story instead." />
  )},

  { lines: [68, 68], render: (d) => (
    <ShotStatement duration={d} kicker="June 2020" text="Seven days." accent="Seven days." />
  )},
  { lines: [69, 71], render: (d) => <ShotCollapse duration={d} /> },
  { lines: [72, 72], render: (d) => (
    <ShotStatement duration={d} kicker="19 June" text="The chief executive resigns." />
  )},
  { lines: [73, 75], render: (d) => (
    <ShotCards duration={d} kicker="19 June · Manila" title="The banks answer"
      cards={[
        { tag: "BDO Unibank", title: "Falsified", body: "Said the document claiming a Wirecard account carried forged signatures of its officers." },
        { tag: "Bank of the Philippine Islands", title: "Spurious", body: "Said the document presented to auditors was not genuine." },
      ]} />
  )},
  { lines: [76, 76], render: (d) => (
    <ShotStatement duration={d} text="The paperwork behind a quarter of the balance sheet was fake."
      accent="was fake" />
  )},
  { lines: [77, 79], render: (d) => (
    <ShotStatement duration={d} kicker="22 June · company statement"
      text="Probably does not exist." accent="does not exist" />
  )},
  { lines: [80, 81], render: (d) => (
    <ShotPhoto duration={d} photo="court.jpg" seed="ct"
      kicker="Munich · 23 to 25 June 2020" title="Arrested, then insolvent" />
  )},
  { lines: [82, 82], render: (d) => (
    <ShotStatement duration={d} text="The first DAX company ever to fail inside the index."
      accent="ever to fail" />
  )},
  { lines: [83, 84], render: (d) => (
    <ShotStats duration={d} kicker="What it cost" title="The scale of it"
      stats={[
        { value: "−90%", label: "share price collapse", accent: true },
        { value: "€17bn", label: "market value erased" },
      ]} />
  )},
  { lines: [85, 87], render: (d) => (
    <ShotStatement duration={d} kicker="Who was holding it"
      text="Index funds held it automatically, because it was in the index." accent="automatically" />
  )},

  { lines: [88, 89], render: (d) => (
    <ShotPhoto duration={d} photo="manila.jpg" seed="mn"
      kicker="Bangko Sentral ng Pilipinas" title="The money never entered the country" />
  )},
  { lines: [90, 91], render: (d) => (
    <ShotStatement duration={d} text="Nobody was made whole." accent="Nobody" />
  )},
  { lines: [92, 93], render: (d) => (
    <ShotStatement duration={d} kicker="Ernst &amp; Young" text="A sophisticated global fraud." />
  )},
  { lines: [94, 95], render: (d) => (
    <ShotStats duration={d} kicker="The audit record" title="Signed, year after year"
      stats={[
        { value: "~10", label: "years as auditor" },
        { value: "Every one", label: "of them signed off", accent: true },
      ]} />
  )},

  { lines: [96, 99], render: (d) => <ShotWanted duration={d} /> },
  { lines: [100, 101], render: (d) => (
    <ShotList duration={d} marker="check" kicker="September 2020" title="The reporters were cleared"
      items={["The investigation into the journalists was dropped", "The reporting had been fundamentally accurate"]} />
  )},
  { lines: [102, 104], render: (d) => (
    <ShotPhoto duration={d} photo="court.jpg" seed="ct2"
      kicker="Munich · December 2022" title="The former chief executive goes on trial" />
  )},
  { lines: [105, 106], render: (d) => (
    <ShotNumber duration={d} value="16 months" countTo={16} suffix=" months"
      kicker="Between the warning and the collapse" label="the warning was public the whole time" />
  )},
  { lines: [107, 109], render: (d) => (
    <ShotStats duration={d} kicker="Afterwards" title="What actually changed"
      stats={[
        { value: "BaFin", label: "leadership replaced" },
        { value: "Audit", label: "market reformed" },
        { value: "FT", label: "awarded for the reporting", accent: true },
      ]} />
  )},

  { lines: [110, 111], render: (d) => (
    <ShotStatement duration={d} text="A country decided in advance which story it wanted to be true."
      accent="in advance" />
  )},
  { lines: [112, 113], render: (d) => (
    <ShotList duration={d} dark marker="dot" kicker="Wirecard was not hidden" title="It was all of these things"
      items={["Audited", "Listed", "Regulated", "Celebrated", "Covered by the press"]} />
  )},
  { lines: [114, 115], render: (d) => (
    <ShotStatement duration={d} text="Every institution built to catch it looked away."
      accent="looked away" />
  )},
  { lines: [116, 117], render: (d) => (
    <ShotStatement duration={d} text="Questioning it was more expensive than believing it."
      accent="more expensive" />
  )},
  { lines: [118, 120], render: (d) => (
    <ShotStatement duration={d} kicker="Scandal files · episode 01"
      text="How expensive it becomes to be the one person who does not." accent="the one person" />
  )},
];

const CREDITS = [
  "Wirecard HQ, Aschheim · Kaethe17 · CC BY-SA 4.0",
  "BaFin building · Thomas Wolf · CC0",
  "Frankfurt Stock Exchange · Ank Kumar · CC BY-SA 4.0",
  "Justizpalast Munich · Martin Falbisoner · CC BY-SA 3.0",
  "Manila skyline · Vyacheslav Argenberg · CC BY 4.0",
  "Munich · Mike is Michi · CC BY-SA 4.0",
  "Wirecard wordmark · public domain",
];

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

export const WirecardEpisode: React.FC = () => {
  const lastShotEnd = (() => {
    const last = SHOTS[SHOTS.length - 1].lines[1];
    return LINES[last - 1].from + LINES[last - 1].durationInFrames;
  })();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.carvao }}>
      <Audio src={staticFile("audio/wirecard-narration.wav")} />

      {SHOTS.map((shot, i) => {
        const first = LINES[shot.lines[0] - 1];
        const last = LINES[shot.lines[1] - 1];
        const from = first.from;
        const duration = last.from + last.durationInFrames - from;
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            {shot.render(duration)}
          </Sequence>
        );
      })}

      <Sequence from={lastShotEnd} durationInFrames={Math.max(TOTAL_FRAMES - lastShotEnd, 1)}>
        <ShotCredits duration={Math.max(TOTAL_FRAMES - lastShotEnd, 1)} lines={CREDITS} />
      </Sequence>

      {LINES.map((line, i) => (
        <Sequence key={`c${i}`} from={line.from} durationInFrames={line.durationInFrames}>
          <EpisodeCaption text={line.text} durationInFrames={line.durationInFrames} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
