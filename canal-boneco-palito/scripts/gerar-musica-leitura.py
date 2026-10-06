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


def page_turn(seconds=0.9):
    """Um 'fshhh' curto e macio de papel, sem estalo."""
    n = int(seconds * SR)
    noise = rng.standard_normal(n)
    spec = np.fft.rfft(noise)
    freqs = np.fft.rfftfreq(n, 1 / SR)
    band = np.exp(-(((freqs - 3200) / 2200) ** 2))  # passa-banda ao redor de 3 kHz
    sh = np.fft.irfft(spec * band, n)
    tt = np.arange(n) / n
    env = np.sin(np.pi * np.clip(tt, 0, 1)) ** 2.2 * (1 - 0.35 * tt)
    sh = sh * env
    sh /= np.max(np.abs(sh)) / 0.5
    return np.stack([sh, sh], axis=1)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    to_mp3(music(), OUT / "leitura-suave.mp3")
    to_mp3(page_turn(), OUT / "virar-pagina.mp3", "128k")
    print("ok:", OUT)
