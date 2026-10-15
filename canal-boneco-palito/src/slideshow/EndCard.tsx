import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { headlineFont } from "../fonts";
import { colors } from "../theme";

export type EndCardProps = {
  title: string;
  subtitle?: string;
  footer?: string;
  /** Tempo na tela, sem contar a transição de entrada. */
  seconds: number;
  /** Imagem de fundo (caminho relativo a public/), em geral a capa do livro. */
  background?: string;
};

const appear = (frame: number, delay: number) => {
  const t = interpolate(frame, [delay, delay + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return { opacity: t, transform: `translateY(${(1 - t) * 26}px)` };
};

// Quadro de encerramento: a capa desfocada e escurecida ao fundo, com os textos
// entrando um de cada vez, no ritmo calmo do resto do vídeo.
export const EndCard: React.FC<EndCardProps> = ({
  title,
  subtitle,
  footer,
  background,
}) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 300], [1.12, 1.2], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1410", overflow: "hidden" }}>
      {background ? (
        <Img
          src={staticFile(background)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(28px) brightness(0.45) saturate(1.1)",
            transform: `scale(${drift})`,
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 160px",
          color: colors.marfim,
          fontFamily: headlineFont,
          textShadow: "0 4px 24px rgba(0,0,0,0.55)",
        }}
      >
        <div
          style={{
            ...appear(frame, 10),
            fontSize: 104,
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <>
            <div
              style={{
                ...appear(frame, 36),
                width: 220,
                height: 3,
                margin: "44px 0",
                backgroundColor: colors.pedra,
                opacity: appear(frame, 36).opacity * 0.8,
              }}
            />
            <div
              style={{
                ...appear(frame, 48),
                fontSize: 54,
                fontWeight: 600,
                lineHeight: 1.3,
              }}
            >
              {subtitle}
            </div>
          </>
        ) : null}
        {footer ? (
          <div
            style={{
              ...appear(frame, 84),
              marginTop: 56,
              fontSize: 44,
              fontWeight: 600,
              fontStyle: "italic",
              color: colors.areia,
            }}
          >
            {footer}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
