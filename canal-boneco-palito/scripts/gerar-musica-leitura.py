#!/usr/bin/env python3
"""Gera a trilha de leitura (pad suave + notas de piano esparsas) e o som de
virar página usados pela composição Slideshow.

Tudo é sintetizado aqui, então a música é original e livre de direitos.
A trilha fecha em loop sem emenda (reverb circular), então dá para repetir
por quanto tempo o vídeo precisar.

Uso: python3 scripts/gerar-musica-leitura.py   (precisa de numpy e ffmpeg)
Saída: public/audio/slideshow/leitura-suave.mp3 e virar-pagina.mp3
"""
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np

SR = 44100
OUT = Path(__file__).resolve().parent.parent / "public" / "audio" / "slideshow"
rng = np.random.default_rng(7)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def to_mp3(stereo, path, bitrate="192k"):
    pcm = (np.clip(stereo, -1, 1) * 32767).astype("<i2")
    with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
        with wave.open(tmp.name, "wb") as w:
            w.setnchannels(2)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes(pcm.tobytes())
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", tmp.name, "-b:a", bitrate, str(path)],
            check=True,
        )


def reverb_circular(x, seconds=3.2, wet=0.38):
    """Reverb por convolução circular: a cauda volta ao início e o loop fecha."""
    n = x.shape[0]
    t = np.arange(int(seconds * SR)) / SR
    out = np.zeros_like(x)
    for ch in range(2):
        ir = rng.standard_normal(t.size) * np.exp(-t / (seconds / 5.5))
        ir[: int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR))
        ir /= np.sqrt(np.sum(ir**2))
        ir_full = np.zeros(n)
        ir_full[: ir.size] = ir
        out[:, ch] = np.fft.irfft(np.fft.rfft(x[:, ch]) * np.fft.rfft(ir_full), n)
    return x * (1 - wet) + out * wet


def music(total_seconds=96):
    n = total_seconds * SR
    t = np.arange(n) / SR
    mix = np.zeros((n, 2))

    # 4 acordes, 6s cada: Cmaj7 | Am7 | Fmaj9 | G6 (ciclo de 24s, 4 voltas)
    chords = [
        [48, 55, 59, 64],
        [45, 52, 55, 60],
        [41, 48, 52, 57, 64],
        [43, 50, 55, 59],
    ]
    chord_len = 6.0

    for i in range(int(total_seconds / chord_len)):
        notes = chords[i % 4]
        start = i * chord_len
        for note in notes:
            for cents in (-4, 0, 4):
                f = midi(note) * 2 ** (cents / 1200)
                length = chord_len + 4.0  # o fim de um acorde passa por baixo do próximo
                tt = np.arange(int(length * SR)) / SR
                env = np.minimum(tt / 2.6, 1) * np.minimum((length - tt) / 3.2, 1)
                env = np.clip(env, 0, 1) ** 1.5
                tone = np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * 2 * f * tt)
                amp = 0.020 / len(notes) * 4
                s = int(start * SR)
                seg = tone * env * amp
                idx = (np.arange(seg.size) + s) % n  # circular
                mix[idx, 0] += seg
                mix[idx, 1] += seg

    # notas de piano suaves, esparsas, em pentatônica de C
    scale = [72, 74, 76, 79, 81, 84, 79, 76, 74]
    beat = 0.75
    pos = 3.0
    while pos < total_seconds - 3.0:
        if rng.random() < 0.55:
            note = int(rng.choice(scale))
            f = midi(note)
            length = 4.5
            tt = np.arange(int(length * SR)) / SR
            tone = (
                np.sin(2 * np.pi * f * tt)
                + 0.45 * np.sin(2 * np.pi * 2 * f * tt) * np.exp(-tt / 0.9)
                + 0.18 * np.sin(2 * np.pi * 3 * f * tt) * np.exp(-tt / 0.5)
            )
            env = np.minimum(tt / 0.012, 1) * np.exp(-tt / 1.6)
            vel = 0.05 + 0.04 * rng.random()
            seg = tone * env * vel
            pan = 0.35 + 0.3 * rng.random()
            s = int(pos * SR)
            idx = (np.arange(seg.size) + s) % n
            mix[idx, 0] += seg * (1 - pan)
            mix[idx, 1] += seg * pan
        pos += beat * rng.choice([2, 3, 4])

    mix = reverb_circular(mix)
    mix /= np.max(np.abs(mix)) / 0.6
    return mix


def page_turn(seconds=1.3):
    """Folha de papel virando: estalos leves ao se soltar, o 'fshhh' no meio do
    movimento e um toque macio ao pousar. Sincronizado com a animação (a folha
    passa pela vertical perto de 50% do som)."""
    n = int(seconds * SR)
    t = np.arange(n) / SR
    freqs = np.fft.rfftfreq(n, 1 / SR)

    def band(x, center, width):
        return np.fft.irfft(np.fft.rfft(x) * np.exp(-(((freqs - center) / width) ** 2)), n)

    # 'fshhh' do ar sob a folha, com pico em ~50% do som
    air = band(rng.standard_normal(n), 3500, 2600)
    air_env = np.exp(-(((t - 0.55 * seconds) / (0.2 * seconds)) ** 2))
    air = air * air_env * 0.9

    # textura do papel: estalos curtos, mais frequentes ao se soltar e no meio
    crackle = np.zeros(n)
    density = 0.0016 + 0.004 * np.exp(-(((t - 0.12) / 0.12) ** 2)) + 0.002 * air_env
    hits = rng.random(n) < density
    crackle[hits] = rng.standard_normal(hits.sum())
    crackle = band(crackle, 5500, 4000)
    crackle *= np.exp(-t / 0.7) * 1.4

    # toque macio ao pousar sobre a outra página
    thump = np.zeros(n)
    land = int(0.88 * seconds * SR)
    m = n - land
    tt = np.arange(m) / SR
    burst = band_low(rng.standard_normal(m), 220)
    thump[land:] = burst * np.exp(-tt / 0.05) * 0.8

    x = air + crackle + thump
    x *= np.minimum(t / 0.01, 1) * np.minimum((seconds - t) / 0.08, 1)  # sem estalo no começo e no fim
    x /= np.max(np.abs(x)) / 0.9
    return np.stack([x, x], axis=1)


def band_low(x, cutoff):
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(x.size, 1 / SR)
    return np.fft.irfft(spec * (f < cutoff), x.size)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    to_mp3(music(), OUT / "leitura-suave.mp3")
    to_mp3(page_turn(), OUT / "virar-pagina.mp3", "128k")
    print("ok:", OUT)
