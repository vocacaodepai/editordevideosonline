"""
Corta o episódio em partes que cabem no limite de upload, sem recomprimir.

Por que existe: o chat aceita no máximo 30 MiB por arquivo e o episódio tem
177 MiB. Cortar no relógio não serve, porque "-c copy" encosta no keyframe mais
próximo e a emenda perde segundos. Então aqui a gente lê os keyframes reais do
arquivo, mede o peso de cada trecho pelos pacotes (não por média de bitrate,
que erra feio nos planos com foto) e corta só onde dá.

Uso:  python3 scripts/cortar-para-upload.py
Saída: out/partes/wirecard-NN.mp4, remontáveis com scripts/juntar-partes.sh
"""

import subprocess, os

BASE = "/home/user/editordevideosonline/canal-boneco-palito"
FF = f"{BASE}/node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg"
FP = f"{BASE}/node_modules/@remotion/compositor-linux-x64-gnu/ffprobe"
SRC = f"{BASE}/out/scandal-files-01-wirecard.mp4"
DEST = f"{BASE}/out/partes"
LIMITE = 26 * 1024 * 1024   # folga sob o limite de 30 MiB do upload

def probe(args):
    return subprocess.run([FP, "-v", "error"] + args + [SRC],
                          capture_output=True, text=True).stdout.strip().splitlines()

# keyframes de video: sao os unicos pontos onde da pra cortar sem recomprimir
kfs = [float(x.rstrip(",")) for x in
       probe(["-select_streams", "v:0", "-skip_frame", "nokey",
              "-show_entries", "frame=pts_time", "-of", "csv=p=0"]) if x.strip()]

# tamanho real de cada pacote, para saber quanto pesa cada trecho de verdade
pkts = []
for lin in probe(["-show_entries", "packet=pts_time,size", "-of", "csv=p=0"]):
    p = lin.split(",")
    if len(p) >= 2 and p[0] not in ("N/A", ""):
        try:
            pkts.append((float(p[0]), int(p[1])))
        except ValueError:
            pass
pkts.sort()

dur = float(probe(["-show_entries", "format=duration", "-of", "csv=p=0"])[0])
kfs = [k for k in kfs if k < dur - 1.0]

def bytes_entre(a, b):
    return sum(s for t, s in pkts if a <= t < b)

# escolhe os cortes: anda pelos keyframes ate encher a cota
cortes = [kfs[0]]
i = 0
while True:
    ini = cortes[-1]
    prox = None
    for k in kfs:
        if k <= ini:
            continue
        if bytes_entre(ini, k) > LIMITE:
            break
        prox = k
    if prox is None or bytes_entre(ini, dur) <= LIMITE:
        break
    cortes.append(prox)
cortes.append(dur)

os.makedirs(DEST, exist_ok=True)
for f in os.listdir(DEST):
    os.remove(os.path.join(DEST, f))

print(f"{len(cortes)-1} partes\n")
for n in range(len(cortes) - 1):
    ini, fim = cortes[n], cortes[n + 1]
    saida = f"{DEST}/wirecard-{n+1:02d}.mp4"
    cmd = [FF, "-v", "error", "-y", "-ss", f"{ini:.6f}"]
    if n < len(cortes) - 2:
        cmd += ["-t", f"{fim - ini - 1.0 / 60.0:.6f}"]
    cmd += ["-i", SRC, "-c", "copy", "-avoid_negative_ts", "make_zero", saida]
    subprocess.run(cmd, check=True)
    mb = os.path.getsize(saida) / 1048576
    print(f"  parte {n+1:02d}  {ini:7.2f}s -> {fim:7.2f}s   {mb:5.1f} MiB")
