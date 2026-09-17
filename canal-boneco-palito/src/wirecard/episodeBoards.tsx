import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../theme";
import { bodyFont, headlineFont, monoFont } from "../fonts";
import {
  Bar,
  Beat,
  BeatSpan,
  Board,
  CellGrid,
  Counter,
  Flow,
  Kicker,
  LineChart,
  Node,
  Pin,
  Row,
  Stamp,
  useBeat,
} from "./board";

/**
 * Os quadros do episódio.
 *
 * Cada quadro cobre um bloco de frases e monta UM diagrama, camada por camada,
 * na batida da narração. Se a frase não acrescenta um elemento ao desenho, ela
 * não ganha quadro próprio: entra como camada do quadro que já está em pé.
 *
 * Padrão de código: cada quadro é uma casca (<Board>) mais um corpo. O corpo
 * precisa ser componente separado porque os hooks de batida leem o contexto
 * que a casca cria, e contexto só vale para descendentes.
 */

const AREA_H = 560;

/* ---------- utilitários de layout ---------- */

const Stack: React.FC<{ children: React.ReactNode; gap?: number; style?: React.CSSProperties }> = ({
  children,
  gap = 0,
  style,
}) => <div style={{ display: "flex", flexDirection: "column", gap, ...style }}>{children}</div>;

const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

const Line: React.FC<{
  line: number;
  size?: number;
  color?: string;
  align?: "left" | "center";
  children: React.ReactNode;
}> = ({ line, size = 52, color = colors.marfim, align = "left", children }) => (
  <Beat line={line} dir="up" dist={26}>
    <div
      style={{
        fontFamily: headlineFont,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1.16,
        color,
        textAlign: align,
      }}
    >
      {children}
    </div>
  </Beat>
);

/* ================================================================== */
/* B1 · 1-5 · abertura                                                 */
/* ================================================================== */

const B1Body: React.FC = () => {
  const missing = useBeat(4);
  return (
    <>
      <Beat line={2} dir="left" dist={30} style={{ marginBottom: 38 }}>
        <div
          style={{
            display: "inline-block",
            padding: "12px 22px",
            borderLeft: `4px solid ${colors.pedra}`,
            fontFamily: monoFont,
            fontWeight: 600,
            fontSize: 24,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "rgba(248,243,231,0.9)",
            backgroundColor: "rgba(16,16,16,0.55)",
          }}
        >
          18 months earlier · worth more than Deutsche Bank
        </div>
      </Beat>

      <Beat line={3} dir="up" dist={22}>
        <Kicker>Missing from the accounts</Kicker>
        <div style={{ marginTop: 6 }}>
          <Counter
            to={1.9}
            decimals={1}
            prefix="€"
            suffix=" bn"
            progress={missing.t}
            size={146}
            color={colors.terracota}
          />
        </div>
      </Beat>

      <div style={{ display: "flex", gap: 46, marginTop: 40 }}>
        <Word label="Misplaced" lag={0} struck />
        <Word label="Frozen" lag={16} struck />
        <Word label="Missing" lag={34} struck={false} />
      </div>
    </>
  );
};

const Word: React.FC<{ label: string; lag: number; struck: boolean }> = ({
  label,
  lag,
  struck,
}) => {
  const { t, opacity } = useBeat(5, lag);
  return (
    <div style={{ opacity, position: "relative", transform: `translateY(${(1 - t) * 18}px)` }}>
      <span
        style={{
          fontFamily: monoFont,
          fontWeight: 600,
          fontSize: 44,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: struck ? "rgba(248,243,231,0.42)" : colors.terracota,
        }}
      >
        {label}
      </span>
      {struck ? (
        <svg
          width="100%"
          height={6}
          style={{ position: "absolute", left: 0, top: "52%" }}
          viewBox="0 0 100 6"
          preserveAspectRatio="none"
        >
          <path
            d="M0 3 L100 3"
            stroke={colors.terracota}
            strokeWidth={4}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - t}
          />
        </svg>
      ) : null}
    </div>
  );
};

export const B1: React.FC = () => (
  <Board
    lines={[1, 5]}
    photo="hq.jpg"
    kicker="Aschheim, Germany · 18 June 2020"
    title="The report nobody would sign"
    seed="b1"
  >
    <B1Body />
  </Board>
);

/* ================================================================== */
/* B2 · 6-9 · um quarto do balanço                                     */
/* ================================================================== */

const B2Body: React.FC = () => {
  const grid = useBeat(6);
  const gone = useBeat(7);
  return (
    <div style={{ display: "flex", gap: 88, alignItems: "flex-start" }}>
      <div style={{ position: "relative" }}>
        <CellGrid total={100} marked={25} progress={grid.t} cols={10} size={38} />
        <div
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: 8,
            backgroundColor: "rgba(28,28,28,0.78)",
            opacity: gone.t * 0.88,
          }}
        />
      </div>

      <Stack gap={26} style={{ flex: 1, paddingTop: 4 }}>
        <Beat line={6} dir="left" dist={30}>
          <div
            style={{
              fontFamily: bodyFont,
              fontSize: 30,
              lineHeight: 1.4,
              color: "rgba(248,243,231,0.86)",
              maxWidth: 700,
            }}
          >
            Each square is one percent of what Wirecard said it held.
            <br />
            <span style={{ color: colors.terracota, fontWeight: 600 }}>
              Twenty five of them were the missing cash.
            </span>
          </div>
        </Beat>

        <Beat line={7} dir="scale">
          <Stamp text="Never existed" progress={gone.t} size={38} />
        </Beat>

        <Beat line={8} dir="up" dist={22}>
          <div
            style={{
              fontFamily: headlineFont,
              fontWeight: 600,
              fontSize: 40,
              lineHeight: 1.18,
              color: colors.marfim,
              maxWidth: 700,
            }}
          >
            A national champion, and a crime scene.
          </div>
        </Beat>

        <Row line={9} kind="cross" color={colors.terracota} strong>
          The people who warned were investigated first.
        </Row>
      </Stack>
    </div>
  );
};

export const B2: React.FC = () => (
  <Board
    lines={[6, 9]}
    kicker="The balance sheet"
    title="A quarter of everything it claimed to own"
    seed="b2"
  >
    <B2Body />
  </Board>
);

/* ================================================================== */
/* B3 · 10-16 · a subida                                               */
/* ================================================================== */

const RISE = [
  { x: 0, y: 0.05 },
  { x: 0.12, y: 0.07 },
  { x: 0.24, y: 0.1 },
  { x: 0.36, y: 0.16 },
  { x: 0.48, y: 0.24 },
  { x: 0.6, y: 0.38 },
  { x: 0.72, y: 0.52 },
  { x: 0.84, y: 0.74 },
  { x: 1, y: 0.95 },
];

const CHART_W = 1480;
const CHART_H = 360;

const B3Body: React.FC = () => {
  const draw = useBeat(14);
  const asia = useBeat(15);
  const rev = useBeat(16);
  return (
    <div style={{ position: "relative", width: CHART_W, height: CHART_H + 80, marginTop: 10 }}>
      <BeatSpan
        line={11}
        until={14}
        dir="left"
        dist={24}
        style={{ position: "absolute", top: 20, left: 0, zIndex: 2 }}
      >
        <Stack gap={18}>
          <Node
            label="Online payment processing"
            sub="Founded 1999, in a suburb of Munich"
            dark={false}
            width={560}
            accent={colors.cacau}
          />
          <div
            style={{
              fontFamily: bodyFont,
              fontSize: 28,
              lineHeight: 1.4,
              color: "rgba(28,28,28,0.72)",
              maxWidth: 620,
            }}
          >
            A middleman taking a small cut of card transactions. Unglamorous work,
            enormous volume.
          </div>
        </Stack>
      </BeatSpan>

      <div style={{ position: "absolute", bottom: 46, left: 0 }}>
        <LineChart
          points={RISE}
          progress={draw.t}
          color="#4E5C3D"
          width={CHART_W}
          height={CHART_H}
        />
      </div>

      <div style={{ position: "absolute", left: CHART_W * 0.6, bottom: 46 + CHART_H * 0.38 }}>
        <Pin x={0} y={0} label="Acquisitions across Asia" progress={asia.t} color={colors.cacau} />
      </div>
      <div style={{ position: "absolute", left: CHART_W * 0.9, bottom: 46 + CHART_H * 0.84 }}>
        <Pin x={0} y={0} label="Revenue up every quarter" progress={rev.t} color={colors.oliva} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 8,
          opacity: draw.t,
          fontFamily: monoFont,
          fontSize: 20,
          letterSpacing: 2.5,
          color: "rgba(28,28,28,0.5)",
        }}
      >
        SHARE PRICE · SHAPE OF THE DECADE
      </div>
    </div>
  );
};

export const B3: React.FC = () => (
  <Board
    lines={[10, 16]}
    dark={false}
    kicker="1999 – 2018"
    title="To understand the fall, you have to understand the climb"
    seed="b3"
  >
    <B3Body />
  </Board>
);

/* ================================================================== */
/* B4 · 17-25 · entrada no DAX                                         */
/* ================================================================== */

const B4Body: React.FC = () => {
  const swap = useBeat(19);
  const wc = useBeat(20);
  const db = useBeat(21);
  return (
    <div style={{ display: "flex", gap: 76 }}>
      <div style={{ width: 620 }}>
        <Beat line={17} dir="left" dist={30}>
          <Kicker>Germany's blue chip index</Kicker>
        </Beat>

        <div style={{ marginTop: 20, position: "relative", height: 208 }}>
          <BeatSpan
            line={18}
            until={19}
            dir="fade"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <Node
              label="Commerzbank"
              sub="Founded 1870 · 148 years of banking history"
              width={560}
              dim
            />
          </BeatSpan>
          <Beat line={19} dir="down" dist={44} style={{ position: "absolute", top: 0, left: 0 }}>
            <Node
              label="Wirecard"
              sub="Founded 1999 · payments, from the suburbs"
              accent={colors.terracota}
              width={560}
            />
          </Beat>
          <div
            style={{
              position: "absolute",
              top: 142,
              left: 4,
              opacity: swap.t,
              fontFamily: monoFont,
              fontSize: 21,
              letterSpacing: 3,
              color: "rgba(248,243,231,0.5)",
            }}
          >
            SEAT TAKEN
          </div>
        </div>

        <Beat line={22} dir="up" dist={22} style={{ marginTop: 10 }}>
          <div style={{ fontFamily: bodyFont, fontSize: 29, color: "rgba(248,243,231,0.82)" }}>
            Analysts called it the German answer to Silicon Valley.
          </div>
        </Beat>
        <div style={{ marginTop: 18 }}>
          <Row line={23} kind="dot" color={colors.lavanda}>
            Politicians called it proof that Europe could still build something.
          </Row>
        </div>
      </div>

      <div style={{ flex: 1, paddingTop: 6 }}>
        <Beat line={20} dir="right" dist={34}>
          <Kicker>Market value · September 2018</Kicker>
        </Beat>
        <div style={{ marginTop: 24 }}>
          <Bar label="Wirecard" value="€24.6 bn" progress={wc.t} fraction={1} color={colors.terracota} />
          <Bar
            label="Deutsche Bank"
            value="€20.5 bn"
            progress={db.t}
            fraction={0.83}
            color={colors.pedra}
            note="The largest lender in the country"
          />
        </div>
        <Beat line={24} dir="up" dist={22} style={{ marginTop: 30 }}>
          <div
            style={{
              fontFamily: headlineFont,
              fontWeight: 700,
              fontSize: 46,
              lineHeight: 1.14,
              color: colors.marfim,
            }}
          >
            A national success story.
          </div>
        </Beat>
        <Beat line={25} dir="scale" style={{ marginTop: 20 }}>
          <Stamp text="Do not look closely" progress={useBeat(25).t} size={26} angle={-4} />
        </Beat>
      </div>
    </div>
  );
};

export const B4: React.FC = () => (
  <Board lines={[17, 25]} kicker="24 September 2018" title="Into the DAX" seed="b4">
    <B4Body />
  </Board>
);

/* ================================================================== */
/* B5 · 26-32 · o fluxo do dinheiro                                    */
/* ================================================================== */

const B5Body: React.FC = () => {
  const partners = useBeat(28);
  const back = useBeat(29);
  const trust = useBeat(30);
  const far = useBeat(31);
  const total = useBeat(32);

  return (
    <div style={{ position: "relative", height: AREA_H }}>
      <svg width={1680} height={AREA_H} style={{ position: "absolute", inset: 0 }}>
        <Flow d="M 340 96 C 430 96, 440 54, 530 54" color={colors.pedra} progress={partners.t} />
        <Flow d="M 340 112 C 430 112, 440 146, 530 146" color={colors.pedra} progress={partners.t} />
        <Flow d="M 340 128 C 430 128, 440 238, 530 238" color={colors.pedra} progress={partners.t} />
        <Flow d="M 880 146 C 980 146, 990 112, 1080 112" color={colors.oliva} progress={back.t} />
        <Flow d="M 1240 190 L 1240 290" color={colors.lavanda} progress={trust.t} />
      </svg>

      <Beat line={27} dir="left" dist={34} style={{ position: "absolute", top: 62, left: 0 }}>
        <Node label="Wirecard" sub="Munich" width={340} accent={colors.terracota} />
      </Beat>

      <div style={{ position: "absolute", top: 10, left: 530 }}>
        <Beat line={28} lag={0} dir="right" dist={30} style={{ marginBottom: 12 }}>
          <Node label="Partner A" sub="Processes payments where Wirecard has no licence" width={340} />
        </Beat>
        <Beat line={28} lag={8} dir="right" dist={30} style={{ marginBottom: 12 }}>
          <Node label="Partner B" width={230} />
        </Beat>
        <Beat line={28} lag={16} dir="right" dist={30}>
          <Node label="Partner C" width={230} />
        </Beat>
      </div>

      <Beat line={29} dir="right" dist={30} style={{ position: "absolute", top: 78, left: 1080 }}>
        <Node label="Booked as Wirecard profit" width={330} accent={colors.oliva} />
      </Beat>

      <Beat line={30} dir="down" dist={36} style={{ position: "absolute", top: 292, left: 1020 }}>
        <Node
          label="Trustee accounts"
          sub="Held by someone else, in the Philippines"
          width={450}
          accent={colors.lavanda}
        />
      </Beat>

      <div
        style={{
          position: "absolute",
          top: 428,
          left: 1020,
          opacity: far.t,
          fontFamily: monoFont,
          fontSize: 21,
          letterSpacing: 2.5,
          color: "rgba(248,243,231,0.55)",
        }}
      >
        10,000 KM FROM ANYONE WHO COULD CHECK
      </div>

      <Beat line={32} dir="up" dist={26} style={{ position: "absolute", top: 380, left: 0 }}>
        <Kicker>On the balance sheet</Kicker>
        <div style={{ marginTop: 4 }}>
          <Counter
            to={1.9}
            decimals={1}
            prefix="€"
            suffix=" bn"
            progress={total.t}
            size={100}
            color={colors.terracota}
          />
        </div>
      </Beat>
    </div>
  );
};

export const B5: React.FC = () => (
  <Board
    lines={[26, 32]}
    kicker="Third party acquiring"
    title="How the money was supposed to move"
    seed="b5"
  >
    <B5Body />
  </Board>
);

/* ================================================================== */
/* B6 · 33-37 · o tamanho, e a falsificação                            */
/* ================================================================== */

const B6Body: React.FC = () => {
  const share = useBeat(34);
  const forged = useBeat(37);
  return (
    <div style={{ display: "flex", gap: 80 }}>
      <div style={{ width: 880 }}>
        <Bar
          label="Third party operation"
          value="most of reported profit"
          progress={share.t}
          fraction={1}
          color={colors.terracota}
          note="Analysts' estimate of where Wirecard's profit came from"
        />
        <Bar
          label="Everything Wirecard ran itself"
          value="the rest"
          progress={share.t}
          fraction={0.3}
          color={colors.pedra}
        />
        <div style={{ marginTop: 14 }}>
          <Row line={35} kind="cross" color={colors.terracota} strong>
            The most important part of the company was the part nobody outside could see.
          </Row>
          <Row line={36} kind="dot" color={colors.pedra}>
            Confirming cash that size normally means asking the bank that holds it, directly.
          </Row>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Beat line={37} dir="scale">
          <div style={{ position: "relative", width: 330, height: 250 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: i * 16,
                  left: i * 14,
                  width: 285,
                  height: 205,
                  borderRadius: 8,
                  border: "2px solid rgba(248,243,231,0.2)",
                  backgroundColor: "rgba(248,243,231,0.05)",
                }}
              />
            ))}
            <div style={{ position: "absolute", top: 96, left: 26 }}>
              <Stamp text="Forged" progress={forged.t} size={38} angle={-11} />
            </div>
          </div>
        </Beat>
      </div>
    </div>
  );
};

export const B6: React.FC = () => (
  <Board
    lines={[33, 37]}
    kicker="Why it mattered"
    title="The part nobody could see was the main part"
    seed="b6"
  >
    <B6Body />
  </Board>
);

/* ================================================================== */
/* B7 · 38-44 · a cadeia do denunciante                                */
/* ================================================================== */

const B7Body: React.FC = () => {
  const toDocs = useBeat(40);
  const blocked = useBeat(41);
  const out = useBeat(42);
  const ft = useBeat(43);
  return (
    <div style={{ position: "relative", height: AREA_H }}>
      <svg width={1680} height={AREA_H} style={{ position: "absolute", inset: 0 }}>
        <Flow d="M 310 70 L 470 70" color={colors.pedra} progress={toDocs.t} />
        <Flow d="M 800 70 L 930 70" color={colors.terracota} progress={blocked.t} dashed={false} />
        <Flow d="M 630 150 L 630 300" color={colors.lavanda} progress={out.t} />
        <Flow d="M 900 340 L 1060 340" color={colors.lavanda} progress={ft.t} />
      </svg>

      <Beat line={39} dir="left" dist={30} style={{ position: "absolute", top: 34, left: 0 }}>
        <Node label="Pav Gill" sub="Wirecard legal department, Singapore" width={310} accent={colors.marfim} />
      </Beat>

      <Beat line={40} dir="scale" style={{ position: "absolute", top: 20, left: 470 }}>
        <Node label="Manipulated accounts" sub="Fictitious transactions" width={320} accent={colors.terracota} />
      </Beat>

      <Beat line={41} dir="right" dist={26} style={{ position: "absolute", top: 40, left: 950 }}>
        <Stamp text="Investigation shut down" progress={blocked.t} size={25} angle={-6} />
      </Beat>

      <Beat line={42} dir="down" dist={34} style={{ position: "absolute", top: 300, left: 470 }}>
        <Node label="He took the documents out" width={400} accent={colors.lavanda} />
      </Beat>

      <Beat line={43} dir="right" dist={32} style={{ position: "absolute", top: 292, left: 1060 }}>
        <Node
          label="Dan McCrum"
          sub="Financial Times · digging for years"
          width={400}
          accent={colors.lavanda}
        />
      </Beat>

      <Beat line={44} dir="up" dist={24} style={{ position: "absolute", top: 440, left: 1060 }}>
        <div style={{ fontFamily: headlineFont, fontWeight: 700, fontSize: 48, color: colors.marfim }}>
          And the FT published.
        </div>
      </Beat>
    </div>
  );
};

export const B7: React.FC = () => (
  <Board lines={[38, 44]} kicker="Singapore" title="What the lawyer found" seed="b7">
    <B7Body />
  </Board>
);

/* ================================================================== */
/* B8 · 45-50 · caso de polícia                                        */
/* ================================================================== */

const B8Body: React.FC = () => {
  const red = useBeat(50);
  return (
    <div style={{ display: "flex", gap: 80 }}>
      <div style={{ width: 900 }}>
        <Row line={45} kind="dot" color={colors.terracota} strong>
          Singapore police raid Wirecard's offices in the city.
        </Row>
        <Row line={46} kind="dot" color={colors.pedra}>
          A police matter now, in a second country.
        </Row>
        <Row line={47} kind="dot" color={colors.pedra}>
          Singapore prosecutors bring charges connected to the case.
        </Row>
        <Row line={48} kind="check" color={colors.terracota} strong>
          A businessman linked to the scheme is sentenced to twelve months.
        </Row>
        <Row line={49} kind="cross" color={colors.terracota} strong>
          The executive named as the architect was never caught.
        </Row>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        <Beat line={50} dir="scale">
          <div
            style={{
              width: 430,
              padding: "34px 32px",
              borderRadius: 12,
              border: `3px solid ${colors.terracota}`,
              backgroundColor: "rgba(201,111,74,0.09)",
            }}
          >
            <div
              style={{
                fontFamily: monoFont,
                fontWeight: 600,
                fontSize: 22,
                letterSpacing: 4,
                color: colors.terracota,
              }}
            >
              INTERPOL
            </div>
            <div
              style={{
                fontFamily: headlineFont,
                fontWeight: 700,
                fontSize: 58,
                color: colors.marfim,
                marginTop: 10,
              }}
            >
              Red notice
            </div>
            <div
              style={{
                fontFamily: bodyFont,
                fontSize: 27,
                color: "rgba(248,243,231,0.74)",
                marginTop: 10,
                opacity: red.t,
              }}
            >
              Still at large.
            </div>
          </div>
        </Beat>
      </div>
    </div>
  );
};

export const B8: React.FC = () => (
  <Board lines={[45, 50]} kicker="February 2019 onwards" title="No longer a reporter's theory" seed="b8">
    <B8Body />
  </Board>
);

/* ================================================================== */
/* B9 · 51-54 · a virada                                               */
/* ================================================================== */

export const B9: React.FC = () => (
  <Board lines={[51, 54]} photo="bafin.jpg" kicker="The turn" title="The regulator picked a side" seed="b9">
    <Stack gap={8} style={{ maxWidth: 1240 }}>
      <Line line={51} size={46}>
        What happened next is the part that should worry you most.
      </Line>
      <div style={{ height: 18 }} />
      <Row line={52} kind="cross" color={colors.pedra}>
        Wirecard did not simply deny the reporting.
      </Row>
      <Row line={53} kind="dot" color={colors.terracota} strong>
        It said it was the victim of market manipulation, of short sellers working with journalists.
      </Row>
      <Row line={54} kind="check" color={colors.terracota} strong>
        And BaFin, Germany's financial regulator, took the company's side.
      </Row>
    </Stack>
  </Board>
);

/* ================================================================== */
/* B10 · 55-61 · as duas decisões                                      */
/* ================================================================== */

const DecisionCard: React.FC<{
  index: string;
  title: string;
  body: string;
  foot: string;
  progress: number;
  footProgress: number;
}> = ({ index, title, body, foot, progress, footProgress }) => (
  <div
    style={{
      padding: "32px 36px",
      borderRadius: 14,
      border: `2px solid ${colors.terracota}`,
      backgroundColor: "rgba(201,111,74,0.07)",
      minHeight: 286,
    }}
  >
    <div
      style={{
        fontFamily: monoFont,
        fontWeight: 600,
        fontSize: 22,
        letterSpacing: 4,
        color: colors.terracota,
        opacity: progress,
      }}
    >
      {index}
    </div>
    <div
      style={{
        fontFamily: headlineFont,
        fontWeight: 700,
        fontSize: 50,
        color: colors.marfim,
        marginTop: 10,
        lineHeight: 1.1,
      }}
    >
      {title}
    </div>
    <div
      style={{
        fontFamily: bodyFont,
        fontSize: 28,
        color: "rgba(248,243,231,0.8)",
        marginTop: 12,
        lineHeight: 1.35,
      }}
    >
      {body}
    </div>
    <div
      style={{
        marginTop: 18,
        paddingTop: 16,
        borderTop: "1px solid rgba(248,243,231,0.16)",
        fontFamily: bodyFont,
        fontWeight: 600,
        fontSize: 25,
        lineHeight: 1.3,
        color: colors.terracota,
        opacity: footProgress,
      }}
    >
      {foot}
    </div>
  </div>
);

const B10Body: React.FC = () => {
  const one = useBeat(56);
  const oneFoot = useBeat(57);
  const two = useBeat(58);
  const twoFoot = useBeat(59);
  return (
    <>
      <div style={{ display: "flex", gap: 44 }}>
        <Beat line={56} dir="left" dist={40} style={{ flex: 1 }}>
          <DecisionCard
            index="01"
            title="Short selling banned"
            body="For two months, on Wirecard shares."
            foot="Never done before for a single company, in the regulator's history."
            progress={one.t}
            footProgress={oneFoot.t}
          />
        </Beat>
        <Beat line={58} dir="right" dist={40} style={{ flex: 1 }}>
          <DecisionCard
            index="02"
            title="Criminal complaints"
            body="Against the Financial Times journalists investigating the company."
            foot="The regulator shielded the company and went after the reporters."
            progress={two.t}
            footProgress={twoFoot.t}
          />
        </Beat>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 34, marginTop: 40 }}>
        <Beat line={60} dir="left" dist={26}>
          <div
            style={{
              fontFamily: monoFont,
              fontSize: 22,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "rgba(248,243,231,0.6)",
            }}
          >
            The signal to everyone watching
          </div>
        </Beat>
        <Beat line={61} dir="scale">
          <Stamp text="Asking questions = suspicious" progress={useBeat(61).t} size={28} angle={-3} />
        </Beat>
      </div>
    </>
  );
};

export const B10: React.FC = () => (
  <Board lines={[55, 61]} kicker="February 2019 · BaFin" title="Two decisions, one day" seed="b10">
    <B10Body />
  </Board>
);

/* ================================================================== */
/* B11 · 62-67 · a auditoria que não fechou                            */
/* ================================================================== */

export const B11: React.FC = () => (
  <Board
    lines={[62, 67]}
    dark={false}
    kicker="KPMG · special audit · April 2020"
    title="An audit hired to prove the newspaper wrong"
    seed="b11"
  >
    <div style={{ maxWidth: 1400 }}>
      <Beat line={63} dir="up" dist={22} style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: bodyFont, fontSize: 32, color: "rgba(28,28,28,0.74)" }}>
          The report arrived, and it did not do that.
        </div>
      </Beat>
      <Row line={64} kind="cross" color={colors.terracota} strong>
        Could not verify the third party business.
      </Row>
      <Row line={65} kind="cross" color={colors.terracota} strong>
        Weaknesses in record keeping, at a regulated financial institution.
      </Row>
      <Row line={66} kind="cross" color={colors.terracota} strong>
        New questions nobody had asked before.
      </Row>
      <Beat line={67} dir="up" dist={24} style={{ marginTop: 26 }}>
        <div
          style={{
            fontFamily: headlineFont,
            fontWeight: 700,
            fontSize: 48,
            color: "#1C1C1C",
            maxWidth: 1220,
            lineHeight: 1.16,
          }}
        >
          An audit commissioned to close the story had just extended it.
        </div>
      </Beat>
    </div>
  </Board>
);

/* ================================================================== */
/* B12 / B13 · 68-82 · os sete dias                                    */
/* ================================================================== */

const DAY_COLLAPSE = [
  { x: 0, y: 0.92 },
  { x: 0.16, y: 0.3 },
  { x: 0.33, y: 0.24 },
  { x: 0.5, y: 0.18 },
  { x: 0.66, y: 0.1 },
  { x: 0.83, y: 0.06 },
  { x: 1, y: 0.03 },
];

const DayCard: React.FC<{
  line: number;
  day: string;
  text: string;
  accent?: boolean;
  muted?: boolean;
}> = ({ line, day, text, accent = false, muted = false }) => {
  const { t, opacity } = useBeat(line);
  const c = accent ? colors.terracota : muted ? "rgba(248,243,231,0.32)" : colors.pedra;
  return (
    <div
      style={{
        flex: 1,
        opacity,
        transform: `translateY(${(1 - t) * 30}px)`,
        padding: "20px 22px",
        borderTop: `3px solid ${c}`,
        backgroundColor: "rgba(248,243,231,0.04)",
      }}
    >
      {day ? (
        <div
          style={{
            fontFamily: monoFont,
            fontWeight: 600,
            fontSize: 23,
            letterSpacing: 3,
            color: c,
            marginBottom: 10,
          }}
        >
          {day.toUpperCase()}
        </div>
      ) : null}
      <div style={{ fontFamily: bodyFont, fontSize: 24, lineHeight: 1.35, color: "rgba(248,243,231,0.9)" }}>
        {text}
      </div>
    </div>
  );
};

const B12Body: React.FC = () => {
  const chart = useBeat(69);
  const drop = useBeat(71);
  const W = 1540;
  const H = 210;
  return (
    <>
      <div style={{ position: "relative", width: W, height: H, marginBottom: 46 }}>
        <LineChart points={DAY_COLLAPSE} progress={chart.t} color={colors.terracota} width={W} height={H} />
        <div style={{ position: "absolute", left: W * 0.2, top: H * 0.74 }}>
          <Pin x={0} y={0} label="−67% in one session" progress={drop.t} color={colors.terracota} side="down" />
        </div>
      </div>

      <div style={{ display: "flex", gap: 18 }}>
        <DayCard line={69} day="Jun 18" text="Ernst and Young refuses to sign the annual accounts." />
        <DayCard line={70} day="" text="It cannot confirm the existence of €1.9 bn." muted />
        <DayCard line={72} day="Jun 19" text="Markus Braun resigns after eighteen years as chief executive." />
        <DayCard line={74} day="" text="BDO Unibank and BPI: the documents were falsified." accent />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 36, marginTop: 34 }}>
        <Beat line={75} dir="left" dist={26}>
          <div
            style={{
              fontFamily: monoFont,
              fontSize: 22,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "rgba(248,243,231,0.6)",
              maxWidth: 520,
              lineHeight: 1.5,
            }}
          >
            Forged signatures of the banks' own officers
          </div>
        </Beat>
        <Beat line={76} dir="scale">
          <Stamp text="Paperwork fake" progress={useBeat(76).t} size={32} angle={-6} />
        </Beat>
      </div>
    </>
  );
};

export const B12: React.FC = () => (
  <Board lines={[68, 76]} kicker="18 – 25 June 2020" title="Seven days" seed="b12">
    <B12Body />
  </Board>
);

const B13Body: React.FC = () => {
  const admit = useBeat(78);
  return (
    <div style={{ display: "flex", gap: 44 }}>
      <div style={{ flex: 1.3 }}>
        <Beat line={77} dir="left" dist={30}>
          <Kicker>June 22 · company statement</Kicker>
        </Beat>
        <Beat line={78} dir="up" dist={26} style={{ marginTop: 16 }}>
          <div
            style={{
              fontFamily: headlineFont,
              fontWeight: 700,
              fontSize: 60,
              lineHeight: 1.1,
              color: colors.marfim,
            }}
          >
            The €1.9 billion
            <br />
            <span style={{ color: colors.terracota }}>probably does not exist.</span>
          </div>
        </Beat>
        <div style={{ display: "flex", gap: 38, marginTop: 28 }}>
          <Phrase word="Not lost" lag={0} />
          <Phrase word="Not stolen in transit" lag={14} />
          <Phrase word="Never there" lag={28} last />
        </div>
        <div style={{ marginTop: 26 }}>
          <Stamp text="€1.9 bn · unaccounted" progress={admit.t} size={25} angle={-5} />
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <DayCard line={80} day="Jun 23" text="Markus Braun is arrested, accused of inflating the balance sheet." accent />
        <div style={{ height: 18 }} />
        <DayCard line={81} day="Jun 25" text="Wirecard files for insolvency in a Munich court." accent />
        <Beat line={82} dir="up" dist={22} style={{ marginTop: 22 }}>
          <div
            style={{
              fontFamily: monoFont,
              fontWeight: 600,
              fontSize: 23,
              letterSpacing: 2.5,
              lineHeight: 1.5,
              textTransform: "uppercase",
              color: colors.terracota,
            }}
          >
            First DAX company ever to fail inside the index
          </div>
        </Beat>
      </div>
    </div>
  );
};

const Phrase: React.FC<{ word: string; lag: number; last?: boolean }> = ({ word, lag, last = false }) => {
  const { t, opacity } = useBeat(79, lag);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${(1 - t) * 16}px)`,
        fontFamily: monoFont,
        fontWeight: 600,
        fontSize: 25,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        color: last ? colors.terracota : "rgba(248,243,231,0.42)",
      }}
    >
      {word}
    </div>
  );
};

export const B13: React.FC = () => (
  <Board lines={[77, 82]} kicker="22 – 25 June 2020" title="The last three days" seed="b13">
    <B13Body />
  </Board>
);

/* ================================================================== */
/* B14 · 83-87 · o estrago                                             */
/* ================================================================== */

const B14Body: React.FC = () => {
  const drop = useBeat(83);
  const value = useBeat(84);
  const close = useBeat(87);
  return (
    <div style={{ display: "flex", gap: 80 }}>
      <div style={{ width: 740 }}>
        <Bar
          label="Share price, across the scandal"
          value="−90%"
          progress={drop.t}
          fraction={0.1}
          color={colors.terracota}
          note="What was left of it"
        />
        <div style={{ marginTop: 16 }}>
          <Kicker>Market value destroyed</Kicker>
          <div style={{ marginTop: 4 }}>
            <Counter to={17} prefix="€" suffix=" bn" progress={value.t} size={108} color={colors.terracota} />
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <Beat line={85} dir="right" dist={30}>
          <Kicker>Who was holding it</Kicker>
        </Beat>
        <div style={{ marginTop: 20 }}>
          <Row line={85} kind="dot" color={colors.lavanda}>
            Pension funds
          </Row>
          <Row line={85} kind="dot" color={colors.lavanda}>
            Index funds, automatically, because it was in the DAX
          </Row>
          <Row line={86} kind="dot" color={colors.lavanda} strong>
            Ordinary savers who had never heard the name
          </Row>
        </div>
        <Beat line={87} dir="up" dist={24} style={{ marginTop: 18, opacity: close.t }}>
          <div
            style={{
              fontFamily: headlineFont,
              fontWeight: 700,
              fontSize: 42,
              lineHeight: 1.16,
              color: colors.terracota,
            }}
          >
            When the index is wrong, everyone owns the mistake.
          </div>
        </Beat>
      </div>
    </div>
  );
};

export const B14: React.FC = () => (
  <Board lines={[83, 87]} kicker="What it cost" title="Seventeen billion euros stopped existing" seed="b14">
    <B14Body />
  </Board>
);

/* ================================================================== */
/* B15 · 88-91 · Filipinas                                             */
/* ================================================================== */

export const B15: React.FC = () => (
  <Board
    lines={[88, 91]}
    photo="manila.jpg"
    kicker="Bangko Sentral ng Pilipinas"
    title="The money never landed"
    seed="b15"
  >
    <Stack gap={4} style={{ maxWidth: 1260 }}>
      <Row line={88} kind="cross" color={colors.terracota} strong>
        The central bank confirmed the money never entered the country's financial system.
      </Row>
      <Row line={89} kind="check" color={colors.pedra}>
        Two bank employees connected to the fraud were barred from working in finance.
      </Row>
      <Row line={90} kind="cross" color={colors.terracota} strong>
        The people who lost money were never going to be made whole.
      </Row>
      <Beat line={91} dir="up" dist={24} style={{ marginTop: 14 }}>
        <div
          style={{
            fontFamily: headlineFont,
            fontWeight: 600,
            fontSize: 40,
            lineHeight: 1.2,
            color: colors.marfim,
            maxWidth: 1180,
          }}
        >
          Selling the pieces of a company whose largest asset was imaginary.
        </div>
      </Beat>
    </Stack>
  </Board>
);

/* ================================================================== */
/* B16 · 92-95 · a década de assinaturas                               */
/* ================================================================== */

const B16Body: React.FC = () => {
  const years = useBeat(94);
  const signed = useBeat(95);
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
        <Beat line={92} dir="left" dist={26}>
          <div
            style={{
              padding: "18px 26px",
              borderLeft: `4px solid ${colors.pedra}`,
              fontFamily: headlineFont,
              fontWeight: 600,
              fontStyle: "italic",
              fontSize: 38,
              color: colors.marfim,
            }}
          >
            "A sophisticated global fraud."
          </div>
        </Beat>
        <Beat line={93} dir="right" dist={26}>
          <div
            style={{
              fontFamily: monoFont,
              fontSize: 22,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: colors.terracota,
            }}
          >
            Unnoticed for how long?
          </div>
        </Beat>
      </div>

      <div style={{ display: "flex", gap: 14, marginTop: 48 }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const p = Math.max(Math.min(years.t * 11 - i, 1), 0);
          const s = Math.max(Math.min(signed.t * 11 - i, 1), 0);
          return (
            <div
              key={i}
              style={{
                flex: 1,
                padding: "18px 0 16px",
                textAlign: "center",
                borderTop: `3px solid ${colors.pedra}`,
                opacity: p,
                transform: `translateY(${(1 - p) * 22}px)`,
              }}
            >
              <div style={{ fontFamily: monoFont, fontSize: 21, color: "rgba(248,243,231,0.55)" }}>
                {2010 + i}
              </div>
              <div
                style={{
                  fontFamily: monoFont,
                  fontWeight: 600,
                  fontSize: 20,
                  letterSpacing: 2,
                  color: colors.terracota,
                  marginTop: 10,
                  opacity: s,
                }}
              >
                SIGNED
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export const B16: React.FC = () => (
  <Board lines={[92, 95]} kicker="Ernst and Young" title="A decade of signatures" seed="b16">
    <B16Body />
  </Board>
);

/* ================================================================== */
/* B17 · 96-99 · o foragido                                            */
/* ================================================================== */

const B17Body: React.FC = () => (
  <Center>
    <Beat line={97} dir="scale">
      <div
        style={{
          width: 940,
          padding: "42px 50px",
          borderRadius: 14,
          border: `3px solid ${colors.terracota}`,
          backgroundColor: "rgba(201,111,74,0.07)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: monoFont,
            fontWeight: 600,
            fontSize: 22,
            letterSpacing: 5,
            color: colors.terracota,
          }}
        >
          WANTED · BUNDESKRIMINALAMT
        </div>
        <div
          style={{
            fontFamily: headlineFont,
            fontWeight: 700,
            fontSize: 80,
            color: colors.marfim,
            marginTop: 12,
          }}
        >
          Jan Marsalek
        </div>
        <div style={{ fontFamily: bodyFont, fontSize: 28, color: "rgba(248,243,231,0.78)", marginTop: 8 }}>
          Chief operating officer · ran the Asian business
        </div>
        <div style={{ display: "flex", gap: 18, justifyContent: "center", marginTop: 24 }}>
          <Status word="Suspended" lag={0} />
          <Status word="Dismissed" lag={13} />
          <Status word="Gone" lag={26} last />
        </div>
        <Beat line={99} dir="up" dist={16} style={{ marginTop: 22 }}>
          <div style={{ fontFamily: bodyFont, fontSize: 26, color: colors.pedra }}>
            Reported to have fled to Moscow. German police still list him as wanted.
          </div>
        </Beat>
      </div>
    </Beat>
  </Center>
);

const Status: React.FC<{ word: string; lag: number; last?: boolean }> = ({ word, lag, last = false }) => {
  const { t, opacity } = useBeat(98, lag);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${(1 - t) * 14}px)`,
        fontFamily: monoFont,
        fontWeight: 600,
        fontSize: 25,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: last ? colors.terracota : "rgba(248,243,231,0.4)",
      }}
    >
      {word}
    </div>
  );
};

export const B17: React.FC = () => (
  <Board lines={[96, 99]} kicker="Still missing" seed="b17">
    <B17Body />
  </Board>
);

/* ================================================================== */
/* B18 · 100-104 · o tribunal                                          */
/* ================================================================== */

export const B18: React.FC = () => (
  <Board lines={[100, 104]} photo="court.jpg" kicker="Munich" title="What the courts did next" seed="b18">
    <Stack gap={2} style={{ maxWidth: 1280 }}>
      <Row line={100} kind="check" color={colors.oliva} strong>
        September 2020: prosecutors drop the investigation into the FT journalists.
      </Row>
      <Row line={101} kind="check" color={colors.oliva} strong>
        The reporting had been fundamentally accurate the entire time.
      </Row>
      <Row line={102} kind="dot" color={colors.pedra}>
        December 2022: Markus Braun goes on trial in Munich.
      </Row>
      <Row line={103} kind="dot" color={colors.terracota} strong>
        Prosecutors call it the largest accounting fraud in German corporate history.
      </Row>
      <Row line={104} kind="dot" color={colors.pedra}>
        Braun denies wrongdoing. A verdict is expected in 2026.
      </Row>
    </Stack>
  </Board>
);

/* ================================================================== */
/* B19 · 105-109 · dezesseis meses                                     */
/* ================================================================== */

const Aftermath: React.FC<{ line: number; text: string; accent?: boolean }> = ({
  line,
  text,
  accent = false,
}) => {
  const { t, opacity } = useBeat(line);
  return (
    <div
      style={{
        flex: 1,
        opacity,
        transform: `translateY(${(1 - t) * 26}px)`,
        padding: "20px 22px",
        borderLeft: `3px solid ${accent ? colors.oliva : colors.pedra}`,
        backgroundColor: "rgba(248,243,231,0.04)",
        fontFamily: bodyFont,
        fontSize: 25,
        lineHeight: 1.35,
        color: accent ? colors.marfim : "rgba(248,243,231,0.84)",
      }}
    >
      {text}
    </div>
  );
};

const B19Body: React.FC = () => {
  const months = useBeat(105);
  return (
    <>
      <Beat line={105} dir="up" dist={26}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
          <Counter to={16} progress={months.t} size={156} color={colors.terracota} />
          <span style={{ fontFamily: headlineFont, fontWeight: 600, fontSize: 58, color: colors.marfim }}>
            months
          </span>
        </div>
      </Beat>

      <div style={{ position: "relative", height: 74, marginTop: 14 }}>
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 0,
            height: 6,
            width: `${months.t * 100}%`,
            backgroundColor: colors.terracota,
            borderRadius: 3,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            opacity: months.t,
            fontFamily: monoFont,
            fontSize: 20,
            letterSpacing: 2,
            color: colors.pedra,
          }}
        >
          FEB 2019 · COMPLAINTS FILED
        </div>
        <div
          style={{
            position: "absolute",
            top: 46,
            right: 0,
            opacity: months.t,
            fontFamily: monoFont,
            fontSize: 20,
            letterSpacing: 2,
            color: colors.terracota,
          }}
        >
          JUN 2020 · COLLAPSE
        </div>
      </div>

      <Beat line={106} dir="up" dist={22} style={{ marginTop: 26 }}>
        <div
          style={{
            fontFamily: headlineFont,
            fontWeight: 600,
            fontSize: 44,
            lineHeight: 1.2,
            color: colors.marfim,
            maxWidth: 1400,
          }}
        >
          The warning was public, documented, and officially treated as the crime.
        </div>
      </Beat>

      <div style={{ display: "flex", gap: 16, marginTop: 34 }}>
        <Aftermath line={107} text="Financial supervision rules rewritten" />
        <Aftermath line={108} text="BaFin's leadership replaced · audit market reformed" />
        <Aftermath
          line={109}
          text="The FT won awards for the reporting the regulator tried to criminalise"
          accent
        />
      </div>
    </>
  );
};

export const B19: React.FC = () => (
  <Board lines={[105, 109]} kicker="The gap" seed="b19">
    <B19Body />
  </Board>
);

/* ================================================================== */
/* B20 · 110-117 · as instituições                                     */
/* ================================================================== */

const INSTITUTIONS = ["Auditors", "The index", "The regulator", "Investors", "The press"];

/**
 * Instituição que tinha acesso ao caso. Em vez de apagar o card (que lê como
 * bug), o card continua legível e recebe um risco diagonal: a decisão de
 * olhar para o lado fica desenhada, não sugerida.
 */
const Institution: React.FC<{ name: string; order: number }> = ({ name, order }) => {
  const appear = useBeat(113, order * 5);
  const away = useBeat(115, order * 6);
  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        opacity: appear.opacity,
        transform: `translateY(${(1 - appear.t) * 24}px)`,
        padding: "26px 18px",
        textAlign: "center",
        borderRadius: 10,
        border: `2px solid rgba(28,28,28,0.3)`,
        backgroundColor: "rgba(255,255,255,0.4)",
        overflow: "hidden",
      }}
    >
      <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 27, color: "#1C1C1C" }}>{name}</div>
      <div
        style={{
          fontFamily: monoFont,
          fontWeight: 600,
          fontSize: 19,
          letterSpacing: 2,
          color: colors.terracota,
          marginTop: 12,
          opacity: away.t,
        }}
      >
        LOOKED AWAY
      </div>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <path
          d="M2 98 L98 2"
          stroke={colors.terracota}
          strokeWidth={1.4}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - away.t}
          opacity={0.75}
        />
      </svg>
    </div>
  );
};

export const B20: React.FC = () => (
  <Board lines={[110, 117]} dark={false} kicker="The lesson" seed="b20">
    <Beat line={111} dir="up" dist={24}>
      <div
        style={{
          fontFamily: headlineFont,
          fontWeight: 700,
          fontSize: 54,
          color: "#1C1C1C",
          maxWidth: 1460,
          lineHeight: 1.12,
        }}
      >
        A country decided in advance which story it wanted to be true.
      </div>
    </Beat>

    <Beat line={112} dir="up" dist={20} style={{ marginTop: 20 }}>
      <div
        style={{
          fontFamily: monoFont,
          fontSize: 22,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "rgba(28,28,28,0.62)",
        }}
      >
        Every institution built to catch it had access
      </div>
    </Beat>

    <div style={{ display: "flex", gap: 14, marginTop: 26 }}>
      {INSTITUTIONS.map((n, i) => (
        <Institution key={n} name={n} order={i} />
      ))}
    </div>

    <Beat line={117} dir="up" dist={22} style={{ marginTop: 34 }}>
      <div
        style={{
          fontFamily: headlineFont,
          fontWeight: 700,
          fontSize: 44,
          color: colors.terracota,
          maxWidth: 1400,
          lineHeight: 1.16,
        }}
      >
        Cheaper to believe it than to question it.
      </div>
    </Beat>
  </Board>
);

/* ================================================================== */
/* B21 · 118-120 · fecho                                               */
/* ================================================================== */

export const B21: React.FC = () => (
  <Board lines={[118, 120]} seed="b21">
    <Center>
      <div style={{ maxWidth: 1400, textAlign: "center" }}>
        <Line line={118} size={48} align="center" color="rgba(248,243,231,0.7)">
          Wirecard is not really a story about one company that lied.
        </Line>
        <div style={{ height: 32 }} />
        <Line line={119} size={60} align="center">
          It is a story about how many people it takes to believe a lie,
        </Line>
        <div style={{ height: 16 }} />
        <Line line={120} size={60} align="center" color={colors.terracota}>
          and how expensive it becomes to be the one person who does not.
        </Line>
      </div>
    </Center>
  </Board>
);

/* ================================================================== */
/* Créditos                                                            */
/* ================================================================== */

export const Credits: React.FC<{ duration: number; lines: string[] }> = ({ duration, lines }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 20, duration - 20, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#1C1C1C", opacity: fade }}>
      <AbsoluteFill style={{ padding: "110px 130px" }}>
        <div
          style={{
            fontFamily: monoFont,
            fontWeight: 600,
            fontSize: 22,
            letterSpacing: 4.5,
            color: "rgba(248,243,231,0.5)",
            textTransform: "uppercase",
          }}
        >
          Images · Wikimedia Commons
        </div>
        <div style={{ marginTop: 32, columnCount: 2, columnGap: 80 }}>
          {lines.map((l, i) => (
            <div
              key={i}
              style={{
                fontFamily: bodyFont,
                fontSize: 23,
                lineHeight: 1.6,
                color: "rgba(248,243,231,0.76)",
                breakInside: "avoid",
                marginBottom: 10,
                opacity: interpolate(frame, [16 + i * 5, 34 + i * 5], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              {l}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
