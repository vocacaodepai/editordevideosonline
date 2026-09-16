import React from "react";
import { StickFigure } from "./StickFigure";
import { colors } from "./theme";
import { CHARACTER } from "./characterStyle";

const RICHARD_ACCENT = colors.oliva;

// Pequenos "sets" reaproveitáveis — mesmo boneco, mesma cor de traço,
// só muda o cenário e a pose, pra manter o personagem consistente do
// capítulo 1 ao 7.

export const GarageSet: React.FC<{ frame: number }> = ({ frame }) => {
  const bob = Math.sin(frame / 8) * 5;
  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: 260,
          left: "50%",
          transform: "translateX(-50%)",
          width: 460,
          height: 10,
          backgroundColor: colors.cacau,
          borderRadius: 6,
        }}
      />
      <div style={{ position: "absolute", bottom: 260, left: "calc(50% - 160px)" }}>
        <StickFigure armLeftAngle={60 + bob} armRightAngle={30} legLeftAngle={10} legRightAngle={-10} />
      </div>
      <div style={{ position: "absolute", bottom: 260, left: "calc(50% + 60px)" }}>
        <StickFigure
          armLeftAngle={-30}
          armRightAngle={60 - bob}
          legLeftAngle={12}
          legRightAngle={-8}
          accentColor={RICHARD_ACCENT}
        />
      </div>
      {[-260, -180, 180, 240].map((x, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: 260,
            left: `calc(50% + ${x}px)`,
            width: 46,
            height: 40,
            backgroundColor: colors.pedra,
            borderRadius: 4,
          }}
        />
      ))}
    </>
  );
};

export const OfficeSet: React.FC<{ frame: number; warm?: boolean }> = ({ frame, warm }) => {
  const bob = Math.sin(frame / 10) * 4;
  return (
    <>
      {[-560, -420, 420, 560].map((x, i) => (
        <svg key={i} width={90} height={150} style={{ position: "absolute", bottom: 240, left: `calc(50% + ${x}px)`, opacity: 0.35 }}>
          <circle cx={45} cy={20} r={16} fill="none" stroke={colors.pedra} strokeWidth={6} />
          <line x1={45} y1={36} x2={45} y2={100} stroke={colors.pedra} strokeWidth={6} strokeLinecap="round" />
        </svg>
      ))}
      <div
        style={{
          position: "absolute",
          bottom: 330,
          left: "50%",
          transform: "translateX(-50%)",
          width: 480,
          height: 12,
          backgroundColor: warm ? colors.oliva : colors.cacau,
          borderRadius: 6,
        }}
      />
      <div style={{ position: "absolute", bottom: 300, left: "calc(50% - 140px)" }}>
        <StickFigure armLeftAngle={70 + bob} armRightAngle={70 - bob} legLeftAngle={12} legRightAngle={-8} />
      </div>
      <div style={{ position: "absolute", bottom: 300, left: "calc(50% + 40px)" }}>
        <StickFigure
          armLeftAngle={70 - bob}
          armRightAngle={70 + bob}
          legLeftAngle={8}
          legRightAngle={-12}
          accentColor={RICHARD_ACCENT}
        />
      </div>
    </>
  );
};

export const CracksSet: React.FC<{ frame: number }> = ({ frame }) => {
  const pace = Math.sin(frame / 14) * 10;
  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: 300,
          left: `calc(50% + 220px + ${pace}px)`,
        }}
      >
        <StickFigure
          armLeftAngle={-100}
          armRightAngle={-70}
          legLeftAngle={14}
          legRightAngle={-6}
          accentColor={RICHARD_ACCENT}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 300,
          left: "calc(50% + 300px)",
          width: 46,
          height: 70,
          borderRadius: 8,
          backgroundColor: colors.carvao,
        }}
      />
      <div style={{ position: "absolute", bottom: 300, left: "calc(50% - 260px)" }}>
        <StickFigure armLeftAngle={20} armRightAngle={-20} legLeftAngle={10} legRightAngle={-10} />
      </div>
    </>
  );
};

export const DiscoverySet: React.FC<{ frame: number; alarmed?: boolean }> = ({ frame }) => {
  const glow = 0.5 + 0.5 * Math.sin(frame / 10);
  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: 320,
          left: "50%",
          transform: "translateX(-50%)",
          width: 260,
          height: 160,
          borderRadius: 8,
          backgroundColor: colors.carvao,
          border: `4px solid ${colors.pedra}`,
          boxShadow: `0 0 ${40 + glow * 30}px rgba(201,111,74,${0.25 + glow * 0.2})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 340,
          left: "50%",
          transform: "translateX(-50%)",
          width: 220,
          height: 120,
          borderRadius: 4,
          backgroundColor: colors.terracota,
          opacity: 0.18 + glow * 0.12,
        }}
      />
      <div style={{ position: "absolute", bottom: 260, left: "50%", transform: "translateX(-50%)" }}>
        <StickFigure
          stroke={colors.pedra}
          armLeftAngle={80}
          armRightAngle={100}
          legLeftAngle={10}
          legRightAngle={-10}
        />
      </div>
    </>
  );
};

export const InvestigationBoardSet: React.FC<{ frame: number }> = ({ frame }) => {
  const reveal = Math.min(1, frame / 60);
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 140,
          left: "50%",
          transform: "translateX(-50%)",
          width: 720,
          height: 340,
          backgroundColor: colors.marfim,
          border: `4px solid ${colors.cacau}`,
          borderRadius: 8,
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 720 340">
          <circle cx={140} cy={100} r={44} fill="none" stroke={colors.terracota} strokeWidth={5} />
          <circle cx={580} cy={100} r={44} fill="none" stroke={colors.oliva} strokeWidth={5} />
          <circle cx={360} cy={250} r={44} fill="none" stroke={colors.carvao} strokeWidth={5} />
          <line x1={180} y1={115} x2={330} y2={230} stroke={colors.carvao} strokeWidth={3} strokeDasharray="8 6" opacity={reveal} />
          <line x1={540} y1={115} x2={390} y2={230} stroke={colors.carvao} strokeWidth={3} strokeDasharray="8 6" opacity={reveal} />
        </svg>
      </div>
      <div style={{ position: "absolute", bottom: 240, left: "50%", transform: "translateX(-50%)" }}>
        <StickFigure armLeftAngle={-40} armRightAngle={-90} legLeftAngle={10} legRightAngle={-10} />
      </div>
    </>
  );
};

export const ConfrontationSet: React.FC<{ frame: number; tense?: boolean }> = ({ frame }) => {
  const shake = Math.sin(frame / 6) * 2;
  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: 300,
          left: "50%",
          transform: "translateX(-50%)",
          width: 420,
          height: 12,
          backgroundColor: colors.cacau,
          borderRadius: 6,
        }}
      />
      <div style={{ position: "absolute", bottom: 312, left: "calc(50% - 190px)", transform: `translateX(${shake}px)` }}>
        <StickFigure armLeftAngle={40} armRightAngle={-10} legLeftAngle={10} legRightAngle={-10} />
      </div>
      <div style={{ position: "absolute", bottom: 312, left: "calc(50% + 60px)" }}>
        <StickFigure
          armLeftAngle={10}
          armRightAngle={-30}
          legLeftAngle={8}
          legRightAngle={-12}
          headY={4}
          accentColor={RICHARD_ACCENT}
        />
      </div>
    </>
  );
};

export const DecisionSet: React.FC<{ frame: number }> = ({ frame }) => {
  const pulseA = 0.85 + 0.15 * Math.sin(frame / 15);
  const pulseB = 0.85 + 0.15 * Math.sin(frame / 15 + Math.PI);
  return (
    <>
      <div style={{ position: "absolute", bottom: 260, left: "50%", transform: "translateX(-50%)" }}>
        <StickFigure armLeftAngle={20} armRightAngle={-20} legLeftAngle={10} legRightAngle={-10} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 220,
          left: "calc(50% - 420px)",
          width: 260,
          height: 160,
          borderRadius: 12,
          backgroundColor: colors.pedra,
          transform: `scale(${pulseA})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 220,
          left: "calc(50% + 160px)",
          width: 260,
          height: 160,
          borderRadius: 12,
          backgroundColor: colors.salvia,
          transform: `scale(${pulseB})`,
        }}
      />
    </>
  );
};

export const ClimaxSet: React.FC<{ frame: number; reveal?: boolean }> = ({ frame }) => {
  const tension = Math.sin(frame / 20) * 3;
  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: 300,
          left: "50%",
          transform: "translateX(-50%)",
          width: 640,
          height: 14,
          backgroundColor: colors.cacau,
          borderRadius: 6,
        }}
      />
      {/* investidores anônimos */}
      <div style={{ position: "absolute", bottom: 312, left: "calc(50% - 300px)", opacity: 0.55 }}>
        <StickFigure stroke={colors.pedra} armLeftAngle={10} armRightAngle={-10} legLeftAngle={10} legRightAngle={-10} />
      </div>
      <div style={{ position: "absolute", bottom: 312, left: "calc(50% - 190px)", opacity: 0.55 }}>
        <StickFigure stroke={colors.pedra} armLeftAngle={10} armRightAngle={-10} legLeftAngle={10} legRightAngle={-10} />
      </div>
      <div style={{ position: "absolute", bottom: 312, left: "calc(50% + 60px)" }}>
        <StickFigure stroke={colors.marfim} armLeftAngle={30} armRightAngle={-10} legLeftAngle={10} legRightAngle={-10} />
      </div>
      <div style={{ position: "absolute", bottom: 312, left: "calc(50% + 240px)", transform: `translateX(${tension}px)` }}>
        <StickFigure
          stroke={colors.marfim}
          armLeftAngle={-10}
          armRightAngle={30}
          legLeftAngle={8}
          legRightAngle={-12}
          headY={4}
          accentColor={RICHARD_ACCENT}
        />
      </div>
    </>
  );
};

export const ResolutionSet: React.FC<{ frame: number }> = ({ frame }) => {
  const bob = Math.sin(frame / 12) * 4;
  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: 300,
          left: "50%",
          transform: "translateX(-50%)",
          width: 480,
          height: 12,
          backgroundColor: colors.oliva,
          borderRadius: 6,
        }}
      />
      <div style={{ position: "absolute", bottom: 312, left: "calc(50% - 140px)" }}>
        <StickFigure armLeftAngle={30 + bob} armRightAngle={-30} legLeftAngle={10} legRightAngle={-10} />
      </div>
      <div style={{ position: "absolute", bottom: 312, left: "calc(50% + 40px)" }}>
        <StickFigure
          armLeftAngle={-30}
          armRightAngle={30 - bob}
          legLeftAngle={8}
          legRightAngle={-12}
          accentColor={RICHARD_ACCENT}
        />
      </div>
    </>
  );
};

export const SET_BACKGROUNDS: Record<string, string> = {
  garage: colors.areia,
  office: colors.marfim,
  cracks: colors.pedra,
  discovery: colors.carvao,
  investigation: colors.marfim,
  confrontation: colors.pedra,
  decision: colors.areia,
  climax: colors.carvao,
  resolution: colors.marfim,
};

export const SET_COMPONENTS: Record<string, React.FC<{ frame: number }>> = {
  garage: GarageSet,
  office: OfficeSet,
  cracks: CracksSet,
  discovery: DiscoverySet,
  investigation: InvestigationBoardSet,
  confrontation: ConfrontationSet,
  decision: DecisionSet,
  climax: ClimaxSet,
  resolution: ResolutionSet,
};

export { CHARACTER };
