import React from "react";
import { CHARACTER } from "./characterStyle";

type Pose = {
  headY?: number;
  armLeftAngle?: number;
  armRightAngle?: number;
  legLeftAngle?: number;
  legRightAngle?: number;
  bodyLean?: number;
};

export const StickFigure: React.FC<
  Pose & { scale?: number; stroke?: string; accentColor?: string }
> = ({
  headY = 0,
  armLeftAngle = 20,
  armRightAngle = -20,
  legLeftAngle = 10,
  legRightAngle = -10,
  bodyLean = 0,
  scale = 1,
  stroke = CHARACTER.stroke,
  accentColor,
}) => {
  const strokeWidth = CHARACTER.strokeWidth;
  const hipX = 100;
  const hipY = 210;
  const shoulderX = 100 + bodyLean;
  const shoulderY = 90;

  const limb = (angleDeg: number, length: number, originX: number, originY: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: originX + Math.sin(rad) * length,
      y: originY + Math.cos(rad) * length,
    };
  };

  const armL = limb(armLeftAngle, 75, shoulderX, shoulderY);
  const armR = limb(armRightAngle, 75, shoulderX, shoulderY);
  const legL = limb(legLeftAngle, 95, hipX, hipY);
  const legR = limb(legRightAngle, 95, hipX, hipY);

  return (
    <svg
      width={220}
      height={340}
      viewBox="0 0 220 340"
      style={{ transform: `scale(${scale})`, overflow: "visible" }}
    >
      <circle
        cx={shoulderX}
        cy={55 + headY}
        r={CHARACTER.headRadius}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <line
        x1={shoulderX}
        y1={55 + headY + CHARACTER.headRadius}
        x2={shoulderX}
        y2={hipY}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <line
        x1={shoulderX}
        y1={shoulderY}
        x2={armL.x}
        y2={armL.y}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <line
        x1={shoulderX}
        y1={shoulderY}
        x2={armR.x}
        y2={armR.y}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <line
        x1={hipX}
        y1={hipY}
        x2={legL.x}
        y2={legL.y}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <line
        x1={hipX}
        y1={hipY}
        x2={legR.x}
        y2={legR.y}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {accentColor && (
        <polygon
          points={`${shoulderX - 8},${55 + headY + CHARACTER.headRadius + 4} ${shoulderX + 8},${55 + headY + CHARACTER.headRadius + 4} ${shoulderX},${55 + headY + CHARACTER.headRadius + 48}`}
          fill={accentColor}
        />
      )}
    </svg>
  );
};
