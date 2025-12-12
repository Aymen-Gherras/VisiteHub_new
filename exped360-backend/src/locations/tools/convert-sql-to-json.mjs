#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

if (process.argv.length < 4) {
  console.error('Usage: node convert-sql-to-json.mjs <input_sql> <output_json>');
  process.exit(1);
}

const inputPath = process.argv[2];
const outputPath = process.argv[3];

const sql = fs.readFileSync(inputPath, 'utf8');

// Very simple parser tailored to the dataset structure:
// Expect INSERT INTO ... VALUES (...), (...);
// and columns including wilaya_name_ascii, daira_name_ascii

const wilayaIndexRe = /\(\s*id\s*,\s*wilaya_code\s*,\s*wilaya_name_ascii\s*,\s*daira_code\s*,\s*daira_name_ascii\s*,/i;
const insertRe = /INSERT\s+INTO\s+[^\(]+\(([^\)]+)\)\s+VALUES\s+([\s\S]*?);/gi;

let columns = null;
let rows = [];
let match;
while ((match = insertRe.exec(sql))) {
  const colsStr = match[1];
  const valuesStr = match[2];
  const cols = colsStr.split(',').map((c) => c.trim().replace(/`/g, ''));
  if (!columns) columns = cols;
  // Split by '),(' boundaries safely
  const tuples = valuesStr
    .trim()
    .replace(/^\(/, '')
    .replace(/\)$/, '')
    .split(/\)\s*,\s*\(/);
  for (const tuple of tuples) {
    const parts = [];
    let cur = '';
    let inStr = false;
    for (let i = 0; i < tuple.length; i++) {
      const ch = tuple[i];
      if (ch === "'") {
        inStr = !inStr;
        cur += ch;
      } else if (ch === ',' && !inStr) {
        parts.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    if (cur) parts.push(cur.trim());
    const obj = {};
    columns.forEach((col, idx) => {
      let v = parts[idx] ?? null;
      if (v && v.startsWith("'")) v = v.slice(1, -1).replace(/''/g, "'");
      obj[col] = v;
    });
    rows.push(obj);
  }
}

// Build map wilaya -> set of dairas (ASCII names)
const map = new Map();
for (const r of rows) {
  const wilaya = r.wilaya_name_ascii || r.wilaya_name || r.wilaya || '';
  const daira = r.daira_name_ascii || r.daira_name || r.daira || '';
  if (!wilaya || !daira) continue;
  if (!map.has(wilaya)) map.set(wilaya, new Set());
  map.get(wilaya).add(daira);
}

const result = Array.from(map.entries()).map(([wilaya, dairaSet]) => ({
  wilaya,
  dairas: Array.from(dairaSet).sort((a, b) => a.localeCompare(b, 'fr')),
})).sort((a, b) => a.wilaya.localeCompare(b.wilaya, 'fr'));

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
console.log(`Wrote ${result.length} wilayas to ${outputPath}`);
