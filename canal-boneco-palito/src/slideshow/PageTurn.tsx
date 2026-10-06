import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { AbsoluteFill, Easing, interpolate, useVideoConfig } from "remotion";

// Virar de página para imagens que são o livro aberto (duas páginas lado a
// lado, lombada no centro). A página da direita se solta, vira em torno da
// lombada e pousa na esquerda, revelando o próximo par de páginas.
//
// O TransitionSeries renderiza esta apresentação uma vez para a cena que sai
// e outra para a que entra, então cada uma desenha só as suas metades:
//   saindo  → metade esquerda parada + frente da folha (metade direita)
//   entrando → metade direita parada (por baixo) + verso da folha (metade esquerda)
// O zIndex mantém a folha sempre por cima das metades paradas.

type PageTurnProps = Record<string, never>;

const PERSPECTIVE_FACTOR = 3.2;

const Half: React.FC<{
  side: "left" | "right";
  children: React.ReactNode;
  width: number;
}> = ({ side, children, width }) => (
  // Mostra metade do quadro: o conteúdo inteiro, deslocado para exibir a
  // metade pedida.
  <div
    style={{
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      width: width / 2,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        width,
        left: side === "left" ? 0 : -width / 2,
      }}
    >
      {children}
    </div>
  </div>
);

const PageTurnPresentation: React.FC<
  TransitionPresentationComponentProps<PageTurnProps>
> = ({ children, presentationDirection, presentationProgress }) => {
  const { width } = useVideoConfig();
  const entering = presentationDirection === "entering";

  // Suaviza o começo e o fim: a folha acelera ao se soltar e freia ao pousar.
  const p = Easing.inOut(Easing.cubic)(presentationProgress);
  const angle = 180 * p;
  const lift = Math.sin(Math.PI * p); // 0 → 1 → 0, máximo com a folha em pé

  // Sombra projetada no que está embaixo, mais forte quando a folha está alta.
  const shadowOnRight = interpolate(p, [0, 0.5, 1], [0, 0.4, 0.05]);
  const shadowOnLeft = interpolate(p, [0, 0.5, 1], [0.05, 0.4, 0]);

  // Escurece levemente a folha quando ela está de lado, como a luz real.
  const faceShade = 0.28 * lift;

  const leafStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: width / 2,
    width: width / 2,
    transformOrigin: "left center",
    transformStyle: "preserve-3d",
    transform: `perspective(${width * PERSPECTIVE_FACTOR}px) rotateY(${-angle}deg)`,
  };

  const faceStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };

  return (
    // Sem zIndex/perspective aqui: isso criaria um contexto de empilhamento por
    // cena e a cena que entra cobriria a folha da que sai.
    <AbsoluteFill>
      {entering ? (
        <>
          {/* Metade direita nova, por baixo da folha que ainda cobre ela. */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: width / 2, width: width / 2, zIndex: 1 }}>
            <Half side="right" width={width}>
              {children}
            </Half>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to right, rgba(0,0,0,${shadowOnRight}), rgba(0,0,0,0) 55%)`,
              }}
            />
          </div>
          {/* Verso da folha: metade esquerda nova, pré-girada para ficar certa ao pousar. */}
          <div style={{ ...leafStyle, zIndex: 3 }}>
            <div style={{ ...faceStyle, transform: "rotateY(180deg)" }}>
              <Half side="left" width={width}>
                {children}
              </Half>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `rgba(0,0,0,${faceShade})`,
                }}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Metade esquerda antiga, que fica até o verso da folha pousar. */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: width / 2, zIndex: 1 }}>
            <Half side="left" width={width}>
              {children}
            </Half>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to left, rgba(0,0,0,${shadowOnLeft}), rgba(0,0,0,0) 55%)`,
              }}
            />
          </div>
          {/* Frente da folha: metade direita antiga. */}
          <div style={{ ...leafStyle, zIndex: 3 }}>
            <div style={faceStyle}>
              <Half side="right" width={width}>
                {children}
              </Half>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `rgba(0,0,0,${faceShade})`,
                }}
              />
            </div>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

export const pageTurn = (): TransitionPresentation<PageTurnProps> => ({
  component: PageTurnPresentation,
  props: {},
});
