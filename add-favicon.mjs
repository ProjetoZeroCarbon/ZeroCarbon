/* ============================================================
   Adiciona o favicon do ZeroCarbon ao <head> de todas as páginas.
   Uso (na RAIZ do projeto):   node add-favicon.mjs
   - Seguro para rodar mais de uma vez (não duplica).
   - Só acrescenta 3 linhas depois do </title>; o resto do arquivo não é alterado.
   Depois de rodar, pode apagar este arquivo.
   ============================================================ */

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const frontendDir = path.join(root, "frontend");

if (!fs.existsSync(frontendDir) || !fs.existsSync(path.join(frontendDir, "assets", "favicon.svg"))) {
  console.error("Não achei frontend/assets/favicon.svg. Rode na raiz do projeto, depois de copiar a pasta assets.");
  process.exit(1);
}

const pages = [
  { file: "index.html", prefix: "frontend/assets" },
  ...fs
    .readdirSync(frontendDir)
    .filter((name) => name.endsWith(".html"))
    .map((name) => ({ file: `frontend/${name}`, prefix: "assets" })),
];

let changed = 0;

for (const { file, prefix } of pages) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) continue;

  const html = fs.readFileSync(full, "utf8");

  if (/<link[^>]+rel=["'](?:shortcut )?icon["']/i.test(html)) {
    console.log(`= ${file}: já tem favicon, não alterei`);
    continue;
  }

  const lines = [
    `<link rel="icon" href="${prefix}/favicon.ico" sizes="32x32">`,
    `<link rel="icon" href="${prefix}/favicon.svg" type="image/svg+xml">`,
    `<link rel="apple-touch-icon" href="${prefix}/apple-touch-icon.png">`,
  ];

  let inserted = false;
  const updated = html.replace(/(<\/title>[^\r\n]*)(\r?\n)/i, (_m, titleLine, eol) => {
    inserted = true;
    return titleLine + eol + lines.join(eol) + eol; // mantém o tipo de quebra de linha do arquivo
  });

  if (!inserted) {
    console.warn(`! ${file}: não encontrei </title>, não alterei`);
    continue;
  }

  fs.writeFileSync(full, updated, "utf8");
  console.log(`+ ${file}: favicon adicionado`);
  changed++;
}

console.log(`\nPronto: ${changed} página(s) alterada(s).`);
