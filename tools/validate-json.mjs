// validate-json.mjs — минимальный валидатор JSON Schema (подмножество draft-07):
// type, required, properties, items, const, enum, pattern, minimum, minItems.
// Usage: node tools/validate-json.mjs <schema.json> <data.json>...
// exit 1 если хоть один файл не прошёл.
import fs from 'fs';

const [, , schemaPath, ...files] = process.argv;
if (!schemaPath || !files.length) {
  console.error('usage: node tools/validate-json.mjs <schema.json> <data.json>...');
  process.exit(2);
}
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, ''));
const schema = readJson(schemaPath);

function typeOf(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  if (typeof v === 'number') return Number.isInteger(v) ? 'integer' : 'number';
  return typeof v; // object | string | boolean
}
function okType(t, v) {
  if (t === 'number' && typeOf(v) === 'integer') return true;
  return typeOf(v) === t;
}
function check(node, sch, path) {
  const errs = [];
  if (sch.const !== undefined && node !== sch.const) errs.push(path + ': const !== ' + JSON.stringify(sch.const));
  if (sch.enum && !sch.enum.includes(node)) errs.push(path + ': not in enum');
  if (sch.type) {
    const types = Array.isArray(sch.type) ? sch.type : [sch.type];
    if (!types.some((t) => okType(t, node))) {
      errs.push(path + ': type ' + typeOf(node) + ' != ' + types.join('|'));
      return errs;
    }
  }
  if (sch.pattern && typeof node === 'string' && !new RegExp(sch.pattern).test(node)) {
    errs.push(path + ': pattern ' + sch.pattern + ' fail');
  }
  if (typeof sch.minimum === 'number' && typeof node === 'number' && node < sch.minimum) {
    errs.push(path + ': < minimum ' + sch.minimum);
  }
  if (sch.minItems !== undefined && Array.isArray(node) && node.length < sch.minItems) {
    errs.push(path + ': items ' + node.length + ' < ' + sch.minItems);
  }
  if (node && typeof node === 'object' && !Array.isArray(node)) {
    for (const r of sch.required || []) {
      if (!(r in node)) errs.push(path + '.' + r + ': required');
    }
    const props = sch.properties || {};
    for (const k of Object.keys(props)) {
      if (k in node) errs.push(...check(node[k], props[k], path + '.' + k));
    }
  }
  if (Array.isArray(node) && sch.items) {
    node.forEach((it, i) => errs.push(...check(it, sch.items, path + '[' + i + ']')));
  }
  return errs;
}

let bad = 0;
for (const f of files) {
  let data;
  try {
    data = readJson(f);
  } catch (e) {
    console.log(f, 'FAIL parse:', e.message);
    bad++;
    continue;
  }
  const errs = check(data, schema, '$');
  if (errs.length) {
    console.log(f, 'FAIL', errs.length, 'errors');
    errs.slice(0, 10).forEach((e) => console.log('  ', e));
    bad++;
  } else {
    console.log(f, 'OK');
  }
}
process.exit(bad ? 1 : 0);
