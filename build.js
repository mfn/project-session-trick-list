#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Read data
// ---------------------------------------------------------------------------

const dataFile = process.argv[2] || 'regular.json';
const outFile  = process.argv[3] || 'index.html';

const dataPath = path.resolve(__dirname, dataFile);
const outPath  = path.resolve(__dirname, outFile);

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const stance = data.stance; // "Regular" or "Goofy"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function flipTrickRows(categories) {
  const parts = [];
  for (const cat of categories) {
    parts.push(`        <tr class="cat-row"><td colspan="3">${esc(cat.name)}</td></tr>`);
    for (const t of cat.tricks) {
      parts.push(
        `        <tr><td>${esc(t.name)}</td>` +
        ` <td class="input">${esc(t.ls)}</td>` +
        ` <td class="input">${esc(t.rs)}</td></tr>`
      );
    }
  }
  return parts.join('\n');
}

function grindRows(categories) {
  const parts = [];
  for (const cat of categories) {
    parts.push(`      <tr class="cat-row"><td colspan="5">${esc(cat.name)}</td></tr>`);
    for (const t of cat.tricks) {
      parts.push(
        `      <tr><td>${esc(t.name)}</td>` +
        ` <td class="ginput">${esc(t.fs.ls)}</td>` +
        ` <td class="ginput">${esc(t.fs.rs)}</td>` +
        ` <td class="ginput">${esc(t.bs.ls)}</td>` +
        ` <td class="ginput">${esc(t.bs.rs)}</td></tr>`
      );
    }
  }
  return parts.join('\n');
}

// ---------------------------------------------------------------------------
// Section builders
// ---------------------------------------------------------------------------

function flipTrickSection(sectionData, sectionTitle) {
  return `\
    <div class="section-title">${esc(sectionTitle)} <span class="section-stance">${esc(stance)}: ${esc(sectionData.label)}</span></div>
    <table>
      <colgroup>
        <col class="col-name">
        <col class="col-1st">
        <col class="col-2nd">
      </colgroup>
      <thead>
        <tr>
          <th>Trick Name</th>
          <th class="col-input">1st Input (LS)</th>
          <th class="col-input">2nd Input (RS)</th>
        </tr>
      </thead>
      <tbody>
${flipTrickRows(sectionData.categories)}
      </tbody>
    </table>`;
}

function grindSection(sectionData, sectionTitle) {
  return `\
    <div class="section-title">${esc(sectionTitle)} <span class="section-stance">${esc(stance)}: ${esc(sectionData.label)}</span></div>
    <table>
      <colgroup>
        <col class="col-grind-name">
        <col class="col-grind-fs-ls">
        <col class="col-grind-fs-rs">
        <col class="col-grind-bs-ls">
        <col class="col-grind-bs-rs">
      </colgroup>
      <thead>
      <tr>
        <th rowspan="2">Trick Name</th>
        <th class="grind-group" colspan="2">Frontside</th>
        <th class="grind-group" colspan="2">Backside</th>
      </tr>
      <tr>
        <th class="grind-sub">LS</th>
        <th class="grind-sub">RS</th>
        <th class="grind-sub">LS</th>
        <th class="grind-sub">RS</th>
      </tr>
      </thead>
      <tbody>
${grindRows(sectionData.categories)}
      </tbody>
    </table>`;
}

function pressureTrickSection(sectionData, sectionTitle) {
  // Reuses same row format as flip tricks
  return `\
    <div class="section-title">${esc(sectionTitle)} <span class="section-stance">${esc(stance)}: ${esc(sectionData.label)}</span></div>
    <table>
      <colgroup>
        <col class="col-name">
        <col class="col-1st">
        <col class="col-2nd">
      </colgroup>
      <thead>
        <tr>
          <th>Trick Name</th>
          <th class="col-input">1st Input (LS)</th>
          <th class="col-input">2nd Input (RS)</th>
        </tr>
      </thead>
      <tbody>
${flipTrickRows(sectionData.categories)}
      </tbody>
    </table>`;
}

// ---------------------------------------------------------------------------
// CSS (embedded verbatim)
// ---------------------------------------------------------------------------

const css = `\
  @page {
    size: landscape;
    margin: 10mm 14mm;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    color: #000;
    background: #fff;
  }

  .page {
    display: flex;
    gap: 24px;
    page-break-after: always;
  }
  .page:last-child { page-break-after: auto; }

  .half {
    flex: 1;
    min-width: 0;
  }

  .section-title {
    font-size: 13pt;
    font-weight: bold;
    border-bottom: 2.5px solid #000;
    padding-bottom: 2px;
    margin-bottom: 1px;
  }

  .section-stance {
    font-weight: normal;
    font-style: italic;
    color: #555;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead th {
    background: #e8e8e8;
    padding: 4px 6px;
    text-align: left;
    font-size: 7.5pt;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    border-bottom: 2px solid #444;
    white-space: nowrap;
  }

  th.col-input {
    text-align: center;
  }

  td {
    padding: 5px 6px;
    border-bottom: 1px solid #ddd;
    font-size: 12pt;
  }

  tr.cat-row td {
    background: #f2f2f2;
    font-weight: bold;
    font-size: 7pt;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    padding-top: 6px;
    padding-bottom: 2px;
    border-bottom: 1.5px solid #aaa;
    color: #444;
  }

  td.input {
    text-align: center;
    font-size: 14pt;
    line-height: 1.1;
    letter-spacing: 2px;
    padding-top: 1px;
    padding-bottom: 1px;
  }

  /* Column widths — flip trick tables */
  col.col-name  { width: 56%; }
  col.col-1st   { width: 24%; }
  col.col-2nd   { width: 20%; }

  /* Column widths — grind tables */
  col.col-grind-name { width: 26%; }
  col.col-grind-fs-ls { width: 8%; }
  col.col-grind-fs-rs { width: 8%; }
  col.col-grind-bs-ls { width: 8%; }
  col.col-grind-bs-rs { width: 8%; }

  /* Grind table header grouping */
  thead th.grind-group {
    text-align: center;
    border-bottom: 1px solid #888;
    font-size: 8pt;
    font-weight: bold;
  }

  thead th.grind-sub {
    font-size: 6.5pt;
    padding: 2px 4px;
  }
  thead th.grind-sub:nth-child(1),
  thead th.grind-sub:nth-child(3) {
    text-align: right;
    padding-right: 2px;
  }
  thead th.grind-sub:nth-child(2),
  thead th.grind-sub:nth-child(4) {
    text-align: left;
    padding-left: 2px;
  }

  td.ginput {
    text-align: center;
    font-size: 13pt;
    line-height: 1.1;
    letter-spacing: 1px;
    padding: 1px 2px;
  }

  /* Visual grouping: pull LS/RS pairs closer within Frontside/Backside */
  td.ginput:nth-child(2),
  td.ginput:nth-child(4) {
    text-align: right;
    padding-right: 2px;
  }
  td.ginput:nth-child(3),
  td.ginput:nth-child(5) {
    text-align: left;
    padding-left: 2px;
  }

  /* 2x2 grid layout for combined pressure flips page */
  .page-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 16px 24px;
  }

  .quarter {
    min-width: 0;
  }

  /* Screen preview: approximate landscape A4 */
  @media screen {
    body { padding: 20px; }
    .page {
      max-width: 1050px;
      margin: 0 auto 40px;
      border: 1px solid #ccc;
      padding: 20px;
      border-radius: 4px;
      background: #fff;
    }
  }

  @media print {
    body { padding: 0; }
  }`;

// ---------------------------------------------------------------------------
// Assemble pages
// ---------------------------------------------------------------------------

const ft = data.flipTricks;
const gr = data.grinds;
const pt = data.pressureTricks;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>SESSION Trick List &ndash; ${esc(stance)} Stance Guide</title>
<style>
${css}
</style>
</head>
<body>

<!-- ==================== PAGE 1: Normal + Nollie — Basic Flip Tricks ==================== -->
<div class="page">

  <!-- LEFT HALF: Normal Stance -->
  <div class="half">
${flipTrickSection(ft.normal, 'Basic Flip Tricks')}
  </div>

  <!-- RIGHT HALF: Nollie Stance -->
  <div class="half">
${flipTrickSection(ft.nollie, 'Basic Flip Tricks')}
  </div>

</div>

<!-- ==================== PAGE 2: Switch + Fakie — Basic Flip Tricks ==================== -->
<div class="page">

  <!-- LEFT HALF: Switch Stance -->
  <div class="half">
${flipTrickSection(ft.switch, 'Basic Flip Tricks')}
  </div>

  <!-- RIGHT HALF: Fakie Stance -->
  <div class="half">
${flipTrickSection(ft.fakie, 'Basic Flip Tricks')}
  </div>

</div>

<!-- ==================== PAGE 3: Normal + Switch — Grinds & Slides ==================== -->
<div class="page">

  <!-- LEFT HALF: Normal Stance Grinds -->
  <div class="half">
${grindSection(gr.normal, 'Basic Grinds & Slides')}
  </div>

  <!-- RIGHT HALF: Switch Stance Grinds -->
  <div class="half">
${grindSection(gr.switch, 'Basic Grinds & Slides')}
  </div>

</div>


<!-- ==================== PAGE 4: All Pressure Flips (2x2 grid) ==================== -->
<div class="page page-grid">

  <!-- TOP-LEFT: Normal Stance Pressure Flips -->
  <div class="quarter">
${pressureTrickSection(pt.normal, 'Basic Pressure Tricks')}
  </div>

  <!-- TOP-RIGHT: Nollie Stance Pressure Flips -->
  <div class="quarter">
${pressureTrickSection(pt.nollie, 'Basic Pressure Tricks')}
  </div>

  <!-- BOTTOM-LEFT: Switch Stance Pressure Flips -->
  <div class="quarter">
${pressureTrickSection(pt.switch, 'Basic Pressure Tricks')}
  </div>

  <!-- BOTTOM-RIGHT: Fakie Stance Pressure Flips -->
  <div class="quarter">
${pressureTrickSection(pt.fakie, 'Basic Pressure Tricks')}
  </div>

</div>


</body>
</html>
`;

// ---------------------------------------------------------------------------
// Write output
// ---------------------------------------------------------------------------

fs.writeFileSync(outPath, html, 'utf8');
console.log(`Built ${outFile} from ${dataFile}`);
