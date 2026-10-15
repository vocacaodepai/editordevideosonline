#!/usr/bin/env node
// Gera o vídeo de um livro a partir de livros/<slug>/livro.json.
//   node scripts/renderizar-livro.mjs macaco-danado            # renderiza
//   node scripts/renderizar-livro.mjs macaco-danado --so-lista # só mostra os tempos
// As imagens ficam em public/livros/<slug>/. O vídeo sai em out/<slug>.mp4.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tempoDeLeitura } from "./tempo-leitura.mjs";

const [slug, ...flags] = process.argv.slice(2);
if (!slug) {
  console.error("Uso: node scripts/renderizar-livro.mjs <slug-do-livro> [--so-lista]");
  process.exit(1);
}

const livro = JSON.parse(readFileSync(`livros/${slug}/livro.json`, "utf8"));
// Encerramento: texto padrão de livros/encerramento-padrao.json, que cada livro pode
// trocar com a chave "encerramento" (use "encerramento": false para não ter quadro).
const padrao = JSON.parse(readFileSync("livros/encerramento-padrao.json", "utf8"));
const enc = livro.encerramento === false ? null : { ...padrao, ...(livro.encerramento ?? {}) };
const images = [];
const durations = [];
const singles = [];
const slideFit = {};

console.log(`\n${livro.titulo}\n`);
console.log("pág.            palavras  segundos");
livro.paginas.forEach((p, i) => {
  const segundos = p.segundos ?? tempoDeLeitura(p.palavras ?? 0);
  images.push(`livros/${slug}/${p.arquivo}`);
  durations.push(segundos);
  if (p.tipo === "capa" || p.tipo === "contracapa") singles.push(i);
  if (p.fit) slideFit[i] = p.fit;
  const rotulo = (p.rotulo ?? p.arquivo).padEnd(30).slice(0, 30);
  console.log(`${rotulo} ${String(p.palavras ?? "-").padStart(4)}  ${String(segundos).padStart(5)}s`);
});
const leitura = durations.reduce((a, b) => a + b, 0);
console.log(`\nleitura: ${leitura}s (${(leitura / 60).toFixed(1)} min), fora as viradas`);
if (enc) console.log(`encerramento: "${enc.titulo}" (${enc.segundos}s)`);
console.log();

if (flags.includes("--so-lista")) process.exit(0);

mkdirSync("out", { recursive: true });
const propsFile = `out/${slug}-props.json`;
const endCard = enc
  ? {
      title: enc.titulo,
      subtitle: enc.subtitulo,
      footer: enc.rodape,
      seconds: enc.segundos,
      background: `livros/${slug}/${enc.fundo ?? livro.paginas[0].arquivo}`,
    }
  : undefined;
writeFileSync(propsFile, JSON.stringify({ images, durations, singles, slideFit, endCard }, null, 2));

const r = spawnSync(
  "npx",
  ["remotion", "render", "Livro", `out/${slug}.mp4`, `--props=${propsFile}`],
  { stdio: "inherit" },
);
process.exit(r.status ?? 1);
