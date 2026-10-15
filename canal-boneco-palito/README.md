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

A duração do vídeo é calculada sozinha. A música (Chopin, Noturno Op. 9 nº 2, gravação Musopen) e o som de página (gravação real) são de domínio público/CC0. Fontes e edição em `public/audio/slideshow/LICENCAS.md`.

## Vídeo de livro (passo a passo)

1. Coloque as imagens em `public/livros/<slug>/`, uma por página dupla, com o nome pela numeração do livro (`04-05.jpg`, `06-07.jpg`...). Capa e contracapa são páginas únicas.
2. Crie `livros/<slug>/livro.json` na ordem de leitura. Cada página tem `arquivo`, `rotulo` e `palavras` (só as da história: sem direitos, ISBN, ficha catalográfica, selo FSC, editora ou crédito de tradução). Use `segundos` para fixar o tempo à mão, `"tipo": "capa"` ou `"contracapa"` para página única e `"fit": "contain"` para imagem que não é 16:9.
3. `node scripts/renderizar-livro.mjs <slug> --so-lista` mostra os tempos; sem a flag, renderiza em `out/<slug>.mp4`. Exemplo pronto: `livros/macaco-danado/livro.json`.

**Encerramento:** todo livro termina com um quadro de agradecimento sobre a capa desfocada. O texto padrão está em `livros/encerramento-padrao.json` (`titulo`, `subtitulo`, `rodape`, `segundos`). Cada livro pode trocar qualquer campo com a chave `"encerramento"` no seu `livro.json` (inclusive `"fundo"`, outra imagem de fundo), ou desligar com `"encerramento": false`.

**Tempo de leitura** (`scripts/tempo-leitura.mjs`): 3s de base mais 0,35s por palavra (cerca de 170 palavras por minuto).

| Palavras | 0 | 1-8 | 9-16 | 17-25 | 26-35 | 36-50 | 51-70 | 70+ |
|---|---|---|---|---|---|---|---|---|
| Segundos | 4 | 6 | 8 | 11 | 14 | 18 | 23 | 23 + 0,35 por palavra extra |

Capa 5s, folha de rosto 6s, página só de créditos 5s.

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
