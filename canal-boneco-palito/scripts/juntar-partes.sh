#!/usr/bin/env bash
#
# Junta as partes do episódio de volta no arquivo completo, sem recomprimir.
#
# Uso:
#   ./scripts/juntar-partes.sh pasta-com-as-partes [saida.mp4]
#
# As partes foram cortadas exatamente em keyframes, com "-c copy", então a
# junção é cópia de fluxo: mesma qualidade do render original, em segundos,
# sem reencode.
#
# Uma ressalva medida, não estimada: o arquivo remontado fica 0,87s mais longo
# que o master (21740 frames contra 21728). São 2 frames repetidos em cada um
# dos 6 pontos de emenda, coisa do contêiner MP4. Áudio e vídeo crescem juntos,
# então NÃO há dessincronia: a legenda continua batendo com a voz do início ao
# fim. Se você quiser o master exato, é mais simples rodar o render de novo:
#   npx remotion render ScandalFiles01Wirecard out/episodio.mp4

set -euo pipefail

PASTA="${1:-}"
SAIDA="${2:-wirecard-completo.mp4}"

if [ -z "$PASTA" ] || [ ! -d "$PASTA" ]; then
  echo "Uso: $0 pasta-com-as-partes [saida.mp4]" >&2
  exit 1
fi

# Usa o ffmpeg do sistema; se não houver, cai no que vem junto com o Remotion.
FF="$(command -v ffmpeg || true)"
if [ -z "$FF" ]; then
  FF="$(dirname "$0")/../node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg"
fi
if [ ! -x "$FF" ]; then
  echo "ffmpeg não encontrado. Instale o ffmpeg ou rode a partir da pasta do projeto." >&2
  exit 1
fi

LISTA="$(mktemp)"
trap 'rm -f "$LISTA"' EXIT

# Ordem alfabética é a ordem correta: wirecard-01, -02, ... -05a, -05b, ...
CONTA=0
for f in "$PASTA"/wirecard-*.mp4; do
  [ -e "$f" ] || continue
  printf "file '%s'\n" "$(cd "$(dirname "$f")" && pwd)/$(basename "$f")" >> "$LISTA"
  CONTA=$((CONTA + 1))
done

if [ "$CONTA" -eq 0 ]; then
  echo "Nenhuma parte wirecard-*.mp4 encontrada em $PASTA" >&2
  exit 1
fi

echo "Juntando $CONTA partes..."
"$FF" -v error -y -f concat -safe 0 -i "$LISTA" -c copy -movflags +faststart "$SAIDA"

echo "Pronto: $SAIDA"
"$FF" -hide_banner -i "$SAIDA" 2>&1 | grep -E "Duration|Stream #0:0" || true
