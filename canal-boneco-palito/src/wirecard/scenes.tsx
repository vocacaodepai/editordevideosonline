import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { colors } from "../theme";
import { bodyFont, headlineFont, monoFont } from "../fonts";
import { Headline, Label, Source, Stamp, StatCard, muted, useFade, useGrow, usePop } from "./kit";

const DARK = colors.carvao;
const LIGHT = colors.marfim;

const Stage: React.FC<{ dark?: boolean; children: React.ReactNode; pad?: number }> = ({
  dark,
  children,
  pad = 96,
}) => (
  <AbsoluteFill style={{ backgroundColor: dark ? DARK : LIGHT, padding: `${pad}px ${pad}px 300px` }}>
    {children}
  </AbsoluteFill>
);

// A legenda ocupa a faixa de baixo, então tudo que é centralizado precisa
// respeitar essa margem pra não ficar escondido atrás dela.
const CAPTION_SAFE = 300;

const Centered: React.FC<{ children: React.ReactNode; gap?: number; row?: boolean }> = ({
  children,
  gap = 30,
  row,
}) => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      flexDirection: row ? "row" : "column",
      gap,
      paddingBottom: CAPTION_SAFE,
      paddingLeft: 96,
      paddingRight: 96,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** 1. Abertura: o parecer que ninguém assinou. */
export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 200], [1, 1.06], { extrapolateRight: "clamp" });
  const lineGrow = useGrow(30, 70);

  return (
    <Stage dark>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${push})` }}>
        <div style={{ width: 1000, opacity: useFade(0, 20) }}>
          <Label onDark>Munich · 18 June 2020</Label>
          <div style={{ marginTop: 26 }}>
            <Headline onDark size={62}>
              Independent auditor&rsquo;s report
            </Headline>
          </div>
          <div style={{ height: 1, backgroundColor: "rgba(248,243,231,0.2)", margin: "40px 0 70px" }} />

          {[0.92, 0.78, 0.86].map((w, i) => (
            <div
              key={i}
              style={{
                height: 14,
                width: `${w * 100 * useGrow(10 + i * 8, 34 + i * 8)}%`,
                backgroundColor: "rgba(248,243,231,0.14)",
                borderRadius: 7,
                marginBottom: 20,
              }}
            />
          ))}

          <div style={{ marginTop: 90, display: "flex", alignItems: "flex-end", gap: 28 }}>
            <div style={{ width: 520 * lineGrow, borderBottom: `2px solid rgba(248,243,231,0.35)`, height: 10 }} />
            <div style={{ paddingBottom: 6 }}>
              <Label onDark size={20}>
                signature
              </Label>
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 300, paddingLeft: 620 }}>
        <Stamp delay={90} rotate={-9}>
          unsigned
        </Stamp>
      </AbsoluteFill>
    </Stage>
  );
};

/** 2. O número: 1,9 bi e a fatia do balanço. */
export const MissingMoney: React.FC = () => {
  const frame = useCurrentFrame();
  const count = interpolate(frame, [6, 66], [0, 1.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const barGrow = useGrow(78, 118);
  const cells = 100;
  const missingCells = 25;

  return (
    <Stage dark>
      <Centered gap={26}>
        <Label onDark>cash Ernst &amp; Young could not confirm</Label>
        <div
          style={{
            fontFamily: headlineFont,
            fontWeight: 700,
            fontSize: 190,
            lineHeight: 1.16,
            color: colors.terracota,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          €{count.toFixed(1)} billion
        </div>

        <div style={{ opacity: useFade(74, 92), marginTop: 10 }}>
          <Label onDark size={22}>
            share of Wirecard&rsquo;s reported balance sheet
          </Label>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", width: 1000, gap: 7, opacity: useFade(74, 92) }}>
          {Array.from({ length: cells }).map((_, i) => {
            const isMissing = i < missingCells;
            const on = i / cells < barGrow;
            return (
              <div
                key={i}
                style={{
                  width: 86,
                  height: 18,
                  borderRadius: 4,
                  backgroundColor: isMissing ? colors.terracota : "rgba(248,243,231,0.16)",
                  opacity: on ? 1 : 0.12,
                }}
              />
            );
          })}
        </div>
        <div style={{ opacity: useFade(118, 136) }}>
          <Label onDark color={colors.terracota} size={26}>
            one in every four euros on the books
          </Label>
        </div>
      </Centered>
    </Stage>
  );
};

/** 3. Cartão de título do episódio. */
export const TitleCard: React.FC = () => {
  const rule = useGrow(20, 56) * 620;
  return (
    <Stage dark>
      <Centered gap={24}>
        <div style={{ opacity: useFade(0, 16) }}>
          <Label onDark>Scandal files · episode 01</Label>
        </div>
        <div style={{ transform: `scale(${usePop(4, 13)})`, textAlign: "center" }}>
          <Headline onDark size={124} style={{ textAlign: "center" }}>
            The money that
            <br />
            never existed
          </Headline>
        </div>
        <div style={{ width: rule, height: 3, backgroundColor: colors.terracota, borderRadius: 3, marginTop: 14 }} />
        <div style={{ opacity: useFade(50, 70) }}>
          <div style={{ fontFamily: bodyFont, fontSize: 34, color: colors.lavanda }}>
            Wirecard AG · 1999 &ndash; 2020
          </div>
        </div>
      </Centered>
    </Stage>
  );
};

/** 4. A subida: linha do tempo 1999 - 2018. */
export const RiseTimeline: React.FC = () => {
  const draw = useGrow(10, 120);
  const marks = [
    { year: "1999", note: "founded near Munich" },
    { year: "2005", note: "listed in Frankfurt" },
    { year: "2014", note: "expansion across Asia" },
    { year: "2018", note: "enters the DAX" },
  ];
  return (
    <Stage>
      <Label>Wirecard AG · company timeline</Label>
      <div style={{ marginTop: 14 }}>
        <Headline size={72}>From a Munich suburb to the DAX</Headline>
      </div>

      <div style={{ position: "relative", marginTop: 150, height: 300 }}>
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            height: 3,
            width: `${draw * 100}%`,
            backgroundColor: colors.carvao,
          }}
        />
        {marks.map((m, i) => {
          const at = i / (marks.length - 1);
          const on = draw > at - 0.02;
          return (
            <div
              key={m.year}
              style={{
                position: "absolute",
                left: `${at * 100}%`,
                top: 0,
                transform: "translateX(-50%)",
                textAlign: "center",
                opacity: on ? 1 : 0,
                width: 320,
              }}
            >
              <div
                style={{
                  fontFamily: headlineFont,
                  fontWeight: 700,
                  fontSize: 58,
                  color: i === marks.length - 1 ? colors.terracota : colors.carvao,
                }}
              >
                {m.year}
              </div>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: i === marks.length - 1 ? colors.terracota : colors.carvao,
                  margin: "12px auto 18px",
                }}
              />
              <div style={{ fontFamily: bodyFont, fontSize: 26, color: muted.onLight }}>{m.note}</div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

/** 5. O momento DAX: comparação de valor de mercado. */
export const DaxMoment: React.FC = () => {
  const bars = [
    { name: "Wirecard", value: 24.6, accent: true },
    { name: "Deutsche Bank", value: 20.5, accent: false },
  ];
  const max = 27;
  const grow = useGrow(14, 66);

  return (
    <Stage>
      <Label>Market capitalisation · September 2018</Label>
      <div style={{ marginTop: 14 }}>
        <Headline size={72}>
          A payments firm passes the country&rsquo;s largest bank
        </Headline>
      </div>

      <div style={{ marginTop: 90, display: "flex", flexDirection: "column", gap: 44 }}>
        {bars.map((b, i) => (
          <div key={b.name}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "flex-end" }}>
              <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 36, color: colors.carvao }}>{b.name}</div>
              <div
                style={{
                  fontFamily: headlineFont,
                  fontWeight: 700,
                  fontSize: 48,
                  color: b.accent ? colors.terracota : colors.carvao,
                  fontVariantNumeric: "tabular-nums",
                  opacity: grow > 0.85 ? 1 : 0,
                }}
              >
                €{b.value.toFixed(1)}bn
              </div>
            </div>
            <div
              style={{
                height: 68,
                width: `${(b.value / max) * 100 * Math.min(1, grow + i * 0.0)}%`,
                backgroundColor: b.accent ? colors.terracota : colors.pedra,
                borderRadius: "0 8px 8px 0",
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 70, opacity: useFade(70, 90), display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 4, height: 64, backgroundColor: colors.oliva, borderRadius: 4 }} />
        <div style={{ fontFamily: bodyFont, fontSize: 30, color: colors.carvao }}>
          Commerzbank, founded in 1870, leaves the index to make room.
        </div>
      </div>

      <Source>Index change effective 24 September 2018</Source>
    </Stage>
  );
};

/** 6. A estrutura: o dinheiro que ficava do outro lado do mundo. */
export const MoneyFlow: React.FC = () => {
  const linkGrow = useGrow(24, 110);
  const vaultPop = usePop(120, 12);
  const partners = ["Partner A", "Partner B", "Partner C"];

  return (
    <Stage dark>
      <Label onDark>Reported structure · third party acquiring</Label>
      <div style={{ marginTop: 14 }}>
        <Headline onDark size={66}>
          Where the profits were supposed to sit
        </Headline>
      </div>

      <svg width={1728} height={400} style={{ marginTop: 46, overflow: "visible" }}>
        {/* nó de origem */}
        <rect x={0} y={150} width={340} height={110} rx={14} fill="rgba(248,243,231,0.09)" />
        <text x={170} y={197} textAnchor="middle" fontFamily={bodyFont} fontWeight={600} fontSize={34} fill={colors.marfim}>
          Wirecard AG
        </text>
        <text x={170} y={235} textAnchor="middle" fontFamily={monoFont} fontSize={22} fill="rgba(248,243,231,0.5)">
          MUNICH
        </text>

        {/* parceiros */}
        {partners.map((p, i) => {
          const y = 40 + i * 135;
          const on = linkGrow > (i + 1) / 5;
          return (
            <g key={p} opacity={on ? 1 : 0.15}>
              <path
                d={`M 340 205 C 520 205, 520 ${y + 38}, 700 ${y + 38}`}
                fill="none"
                stroke={colors.pedra}
                strokeWidth={3}
                strokeDasharray="10 8"
              />
              <rect x={700} y={y} width={300} height={76} rx={12} fill="rgba(248,243,231,0.06)" stroke={colors.pedra} strokeWidth={2} />
              <text x={850} y={y + 48} textAnchor="middle" fontFamily={bodyFont} fontSize={28} fill={colors.marfim}>
                {p}
              </text>
              <path
                d={`M 1000 ${y + 38} C 1160 ${y + 38}, 1160 205, 1320 205`}
                fill="none"
                stroke={colors.pedra}
                strokeWidth={3}
                strokeDasharray="10 8"
              />
            </g>
          );
        })}

        {/* cofre */}
        <g transform={`translate(1320 120) scale(${vaultPop})`}>
          <rect x={0} y={0} width={400} height={170} rx={14} fill={colors.terracota} />
          <text x={200} y={62} textAnchor="middle" fontFamily={monoFont} fontSize={22} letterSpacing={3} fill={colors.marfim}>
            TRUSTEE ACCOUNTS
          </text>
          <text x={200} y={122} textAnchor="middle" fontFamily={headlineFont} fontWeight={700} fontSize={54} fill={colors.marfim}>
            €1.9bn
          </text>
          <text x={200} y={158} textAnchor="middle" fontFamily={monoFont} fontSize={20} fill="rgba(248,243,231,0.75)">
            PHILIPPINES
          </text>
        </g>
      </svg>
    </Stage>
  );
};

/** 7. O jornalista: os relatos que ninguém quis ouvir. */
export const Journalist: React.FC = () => {
  const cards = [
    "The House of Wirecard",
    "Documents from a whistleblower in Singapore",
    "Questions about the Asian operations",
  ];
  return (
    <Stage>
      <Label>Reporting · Financial Times</Label>
      <div style={{ marginTop: 14 }}>
        <Headline size={72}>Someone had been saying this for years</Headline>
      </div>

      <div style={{ marginTop: 80, display: "flex", flexDirection: "column", gap: 26 }}>
        {cards.map((c, i) => (
          <div
            key={c}
            style={{
              transform: `translateX(${(1 - usePop(20 + i * 22)) * -60}px)`,
              opacity: usePop(20 + i * 22),
              backgroundColor: colors.areia,
              borderLeft: `6px solid ${colors.oliva}`,
              borderRadius: "0 14px 14px 0",
              padding: "30px 40px",
              maxWidth: 1400,
            }}
          >
            <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 38, color: colors.carvao }}>{c}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 60, opacity: useFade(110, 130) }}>
        <div style={{ fontFamily: bodyFont, fontSize: 30, color: muted.onLight, maxWidth: 1300 }}>
          Reporter Dan McCrum investigated the company&rsquo;s accounting for years before the collapse.
        </div>
      </div>
    </Stage>
  );
};

/** 8. O regulador: as duas decisões de fevereiro de 2019. */
export const RegulatorTurns: React.FC = () => {
  const a = usePop(16, 13);
  const b = usePop(52, 13);
  return (
    <Stage dark>
      <Label onDark>BaFin · February 2019</Label>
      <div style={{ marginTop: 14 }}>
        <Headline onDark size={70}>The regulator picked a side</Headline>
      </div>

      <div style={{ marginTop: 80, display: "flex", gap: 40 }}>
        {[
          {
            pop: a,
            tag: "Decision 01",
            title: "Short selling banned",
            body: "Two months. The first time the regulator had ever shielded a single listed company this way.",
          },
          {
            pop: b,
            tag: "Decision 02",
            title: "Criminal complaints filed",
            body: "Against the Financial Times journalists who were investigating the company&rsquo;s accounts.",
          },
        ].map((card) => (
          <div
            key={card.tag}
            style={{
              flex: 1,
              transform: `scale(${card.pop})`,
              backgroundColor: "rgba(248,243,231,0.06)",
              border: `2px solid ${colors.terracota}`,
              borderRadius: 18,
              padding: "38px 42px",
            }}
          >
            <Label onDark color={colors.terracota} size={22}>
              {card.tag}
            </Label>
            <div style={{ marginTop: 18 }}>
              <Headline onDark size={54}>
                {card.title}
              </Headline>
            </div>
            <div
              style={{
                marginTop: 22,
                fontFamily: bodyFont,
                fontSize: 30,
                lineHeight: 1.45,
                color: "rgba(248,243,231,0.75)",
              }}
              dangerouslySetInnerHTML={{ __html: card.body }}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 56, opacity: useFade(96, 120) }}>
        <Label onDark size={28} color={colors.marfim}>
          the company was protected. the reporters were investigated.
        </Label>
      </div>
    </Stage>
  );
};

/** 9. A auditoria especial que deveria encerrar o caso. */
export const SpecialAudit: React.FC = () => {
  const findings = [
    "could not verify the third party business",
    "weaknesses in record keeping",
    "new questions nobody had asked",
  ];
  return (
    <Stage>
      <Label>KPMG special audit · April 2020</Label>
      <div style={{ marginTop: 14 }}>
        <Headline size={70}>Commissioned to end the story</Headline>
      </div>

      <div style={{ marginTop: 74, display: "flex", gap: 70, alignItems: "flex-start" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 30 }}>
          {findings.map((f, i) => (
            <div key={f} style={{ display: "flex", gap: 22, alignItems: "center", opacity: usePop(18 + i * 26) }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 8,
                  border: `3px solid ${colors.terracota}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: monoFont,
                  fontSize: 28,
                  color: colors.terracota,
                }}
              >
                ✕
              </div>
              <div style={{ fontFamily: bodyFont, fontSize: 36, color: colors.carvao }}>{f}</div>
            </div>
          ))}
        </div>

        <div style={{ width: 520, display: "flex", justifyContent: "center", paddingTop: 30 }}>
          <Stamp delay={104} rotate={-6} color={colors.cacau}>
            not confirmed
          </Stamp>
        </div>
      </div>
    </Stage>
  );
};

/** 10. Sete dias: o colapso da ação com marcação por dia. */
export const SevenDays: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const chartW = 1560;
  const chartH = 440;
  const series = [104, 104, 39, 25, 25, 14, 12, 3, 2.5];
  const maxY = 110;
  const draw = useGrow(20, durationInFrames - 90);
  const visible = Math.max(2, Math.round(series.length * draw));
  const shown = series.slice(0, visible);
  const pt = (v: number, i: number) => ({
    x: (i / (series.length - 1)) * chartW,
    y: chartH - (v / maxY) * chartH,
  });
  const coords = shown.map(pt);
  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const head = coords[coords.length - 1];

  const events = [
    { i: 2, label: "18 Jun · EY refuses to sign" },
    { i: 4, label: "19 Jun · CEO resigns" },
    { i: 6, label: "23 Jun · CEO arrested" },
    { i: 8, label: "25 Jun · insolvency" },
  ];

  return (
    <Stage dark>
      <Label onDark>Wirecard share price · June 2020</Label>
      <div style={{ marginTop: 14 }}>
        <Headline onDark size={70}>Seven days</Headline>
      </div>

      <svg width={chartW} height={chartH + 80} style={{ marginTop: 60, overflow: "visible" }}>
        {[0, 0.5, 1].map((g) => (
          <line key={g} x1={0} y1={chartH * g} x2={chartW} y2={chartH * g} stroke="rgba(248,243,231,0.12)" strokeWidth={1} />
        ))}
        <path d={`${path} L ${head.x} ${chartH} L 0 ${chartH} Z`} fill={colors.terracota} opacity={0.14} />
        <path d={path} fill="none" stroke={colors.terracota} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={head.x} cy={head.y} r={11} fill={colors.terracota} stroke={DARK} strokeWidth={4} />
        <line x1={0} y1={chartH} x2={chartW} y2={chartH} stroke="rgba(248,243,231,0.4)" strokeWidth={2} />

        {events.map((e) => {
          const p = pt(series[e.i], e.i);
          const on = visible > e.i;
          return (
            <g key={e.label} opacity={on ? 1 : 0}>
              <line x1={p.x} y1={p.y} x2={p.x} y2={chartH} stroke="rgba(248,243,231,0.25)" strokeWidth={2} strokeDasharray="6 6" />
              <circle cx={p.x} cy={p.y} r={8} fill={colors.marfim} />
              <text
                x={p.x}
                y={p.y - 28}
                textAnchor={e.i > 5 ? "end" : "middle"}
                fontFamily={monoFont}
                fontSize={22}
                letterSpacing={1}
                fill={colors.marfim}
              >
                {e.label}
              </text>
            </g>
          );
        })}
      </svg>
    </Stage>
  );
};

/** 10b. O saldo do colapso. */
export const CollapseStats: React.FC = () => (
  <Stage dark>
    <Label onDark>What the collapse cost</Label>
    <div style={{ marginTop: 14 }}>
      <Headline onDark size={70}>The scale of it</Headline>
    </div>
    <div style={{ marginTop: 90, display: "flex", gap: 28 }}>
      <StatCard value="−90%" label="share price, peak to collapse" delay={10} onDark accent={colors.terracota} />
      <StatCard value="€17bn" label="market value erased" delay={28} onDark />
      <StatCard value="1st" label="DAX member ever to fail" delay={46} onDark />
    </div>
  </Stage>
);

/** 11. O dinheiro que nunca chegou. */
export const NeverArrived: React.FC = () => (
  <Stage>
    <Label>Bangko Sentral ng Pilipinas · statement</Label>
    <div style={{ marginTop: 14 }}>
      <Headline size={72}>The money never entered the country</Headline>
    </div>
    <div style={{ marginTop: 90, display: "flex", alignItems: "center", gap: 46, opacity: usePop(20) }}>
      <div
        style={{
          fontFamily: headlineFont,
          fontWeight: 700,
          fontSize: 150,
          color: colors.pedra,
          textDecoration: "line-through",
          textDecorationColor: colors.terracota,
          textDecorationThickness: 10,
        }}
      >
        €1.9bn
      </div>
      <div style={{ fontFamily: bodyFont, fontSize: 36, lineHeight: 1.45, color: colors.carvao, maxWidth: 800 }}>
        The Philippine central bank said the funds never entered its financial system. The trustee
        accounts appear to have been a fiction.
      </div>
    </div>
  </Stage>
);

/** 12. O executivo que sumiu. */
export const StillMissing: React.FC = () => (
  <Stage dark>
    <Centered gap={30}>
      <div style={{ transform: `scale(${usePop(6, 13)})`, display: "flex", gap: 44, alignItems: "center" }}>
        <div
          style={{
            width: 240,
            height: 300,
            borderRadius: 14,
            border: `3px dashed rgba(248,243,231,0.3)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: monoFont,
            fontSize: 26,
            letterSpacing: 3,
            color: "rgba(248,243,231,0.35)",
          }}
        >
          NO PHOTO
        </div>
        <div>
          <Label onDark color={colors.terracota}>status · missing</Label>
          <div style={{ marginTop: 16 }}>
            <Headline onDark size={92}>Jan Marsalek</Headline>
          </div>
          <div style={{ marginTop: 18, fontFamily: bodyFont, fontSize: 34, color: "rgba(248,243,231,0.75)", maxWidth: 760 }}>
            Chief operating officer. Ran the Asian business. Suspended, dismissed, and then gone.
            Reported to have fled to Moscow. Still not found.
          </div>
        </div>
      </div>
    </Centered>
  </Stage>
);

/** 13. Os dezesseis meses entre o alerta e o colapso. */
export const SixteenMonths: React.FC = () => {
  const grow = useGrow(16, 90);
  return (
    <Stage>
      <Label>Gap between the warning and the collapse</Label>
      <div style={{ marginTop: 14 }}>
        <Headline size={72}>Sixteen months</Headline>
      </div>

      <div style={{ marginTop: 120, position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ maxWidth: 560 }}>
            <Label size={22}>February 2019</Label>
            <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 34, color: colors.carvao, marginTop: 8 }}>
              Complaints filed against the reporters
            </div>
          </div>
          <div style={{ maxWidth: 560, textAlign: "right" }}>
            <Label size={22}>June 2020</Label>
            <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 34, color: colors.terracota, marginTop: 8 }}>
              The company collapses
            </div>
          </div>
        </div>
        <div style={{ height: 22, backgroundColor: colors.areia, borderRadius: 11, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${grow * 100}%`, backgroundColor: colors.terracota }} />
        </div>
        <div style={{ marginTop: 50, opacity: useFade(90, 112) }}>
          <div style={{ fontFamily: bodyFont, fontSize: 32, color: colors.carvao }}>
            In September 2020, prosecutors dropped the case against the journalists. The reporting had
            been fundamentally accurate.
          </div>
        </div>
      </div>
    </Stage>
  );
};

/** 14. O que mudou depois. */
export const Aftermath: React.FC = () => (
  <Stage>
    <Label>What changed afterwards</Label>
    <div style={{ marginTop: 14 }}>
      <Headline size={70}>Germany rewrote the rules</Headline>
    </div>
    <div style={{ marginTop: 90, display: "flex", gap: 30 }}>
      <StatCard value="BaFin" label="leadership replaced" delay={14} />
      <StatCard value="Audit" label="market reformed" delay={34} />
      <StatCard value="DAX" label="listing rules tightened" delay={54} />
    </div>
  </Stage>
);

/** 15. Encerramento. */
export const Closing: React.FC = () => (
  <Stage dark>
    <Centered gap={40}>
      <div style={{ opacity: useFade(0, 24), textAlign: "center", maxWidth: 1500 }}>
        <Headline onDark size={70} style={{ textAlign: "center" }}>
          Wirecard was not hidden.
        </Headline>
      </div>
      <div style={{ opacity: useFade(40, 70), textAlign: "center", maxWidth: 1400 }}>
        <div style={{ fontFamily: bodyFont, fontSize: 40, lineHeight: 1.5, color: "rgba(248,243,231,0.8)" }}>
          It was audited, listed, regulated and celebrated. Every institution built to catch this had
          access to it, and looked away.
        </div>
      </div>
      <div style={{ width: 460, height: 3, backgroundColor: colors.terracota, borderRadius: 3, opacity: useFade(80, 100) }} />
      <div style={{ opacity: useFade(96, 124), textAlign: "center" }}>
        <Label onDark size={28} color={colors.lavanda}>
          Scandal files · new case every week
        </Label>
      </div>
    </Centered>
  </Stage>
);
