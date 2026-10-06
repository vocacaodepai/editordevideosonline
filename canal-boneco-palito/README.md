# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Slideshow de imagens / livro em vídeo

Composição `Slideshow`: transforma uma lista de imagens em vídeo com transição entre elas. A `SlideshowTeste` já vem configurada como **livro em vídeo**: páginas viram uma a uma, com tempo para ler, música suave e som de papel.

```console
npx remotion render SlideshowTeste out/livro-teste.mp4
# ou com suas imagens (caminhos relativos a public/):
npx remotion render Slideshow out/meu-video.mp4 --props='{"images":["media/a.jpg","media/b.jpg"],"transitionType":"slide"}'
```

Props (todas opcionais, menos `images`):
- `secondsPerImage` (3): tempo em que a imagem fica **inteira na tela**, sem contar a transição. É o tempo de leitura. `durations` (lista, em segundos) define um tempo por imagem, por exemplo mais para páginas com muito texto.
- `transitionType`: `pageTurn` (vira a página; as imagens devem ser o livro aberto, com a lombada no centro), `fade`, `slide`, `wipe`, `flip`, `clockWipe` ou `mix`. `transitionSeconds` (1) define a duração.
- `coverFirst` (true): com `pageTurn`, a primeira imagem é a capa (página única) e entra com fade.
- `audio` e `audioVolume`: música em loop, com entrada e saída suaves. `pageSound` e `pageSoundVolume`: som a cada página virada.
- `fit` (`contain`/`cover`), `zoom` (0.06; use 0 para leitura), `background`, `width`/`height` (1920x1080; 1080x1920 para vertical).

A duração do vídeo é calculada sozinha. A música e o som de página são gerados por `python3 scripts/gerar-musica-leitura.py` (original, sem direitos autorais; precisa de numpy e ffmpeg).

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
