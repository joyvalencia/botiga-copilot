import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { crearApp } from '../src/app.js';
import { crearBaseDades } from '../src/db.js';

let servidor;
let base;

before(() => {
  servidor = crearApp(crearBaseDades()).listen(0);
  base = `http://localhost:${servidor.address().port}`;
});

after(() => servidor.close());

test('GET /api/productes retorna tots els productes', async () => {
  const resposta = await fetch(`${base}/api/productes`);
  assert.equal(resposta.status, 200);
  const productes = await resposta.json();
  assert.equal(productes.length, 6);
});

test('POST /api/carret/total retorna subtotal, enviament i total', async () => {
  const resposta = await fetch(`${base}/api/carret/total`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ preu: 20, quantitat: 1 }] }),
  });

  assert.equal(resposta.status, 200);
  assert.deepEqual(await resposta.json(), {
    subtotal: 20,
    enviament: 3.9,
    total: 23.9,
  });
});

test('POST /api/carret/total aplica enviament gratuït després del descompte', async () => {
  const resposta = await fetch(`${base}/api/carret/total`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ preu: 60, quantitat: 1 }],
      descompte: 10,
    }),
  });

  assert.deepEqual(await resposta.json(), {
    subtotal: 54,
    enviament: 0,
    total: 54,
  });
});

test('GET /api/categories retorna les categories amb el nombre de productes', async () => {
  const resposta = await fetch(`${base}/api/categories`);
  assert.equal(resposta.status, 200);
  const categories = await resposta.json();

  assert.deepEqual(categories, [
    { categoria: 'casa', numProductes: 2 },
    { categoria: 'papereria', numProductes: 2 },
    { categoria: 'roba', numProductes: 2 },
  ]);
});

test('GET /api/categories retorna una categoria sense duplicats', async () => {
  const resposta = await fetch(`${base}/api/categories`);
  const categories = await resposta.json();
  const nomsCategories = categories.map((categoria) => categoria.categoria);

  assert.equal(new Set(nomsCategories).size, categories.length);
  assert.ok(categories.every((categoria) => categoria.numProductes > 0));
});

test('GET /api/productes calcula la mitjana i el nombre de ressenyes', async () => {
  const resposta = await fetch(`${base}/api/productes`);
  const productes = await resposta.json();
  const producte = productes.find((p) => p.id === 1);

  assert.equal(producte.mitjana, 4);
  assert.equal(producte.numRessenyes, 2);
});

test('GET /api/productes indica que el producte 2 no té ressenyes', async () => {
  const resposta = await fetch(`${base}/api/productes`);
  const productes = await resposta.json();
  const producte = productes.find((p) => p.id === 2);

  assert.equal(producte.mitjana, null);
  assert.equal(producte.numRessenyes, 0);
});

test('GET /api/productes?categoria=roba filtra per categoria', async () => {
  const resposta = await fetch(`${base}/api/productes?categoria=roba`);
  const productes = await resposta.json();
  assert.ok(productes.every((p) => p.categoria === 'roba'));
});

test('GET /api/productes/:id retorna 404 si no existeix', async () => {
  const resposta = await fetch(`${base}/api/productes/999`);
  assert.equal(resposta.status, 404);
});

test('GET / mostra un peu de pàgina amb informació bàsica de la botiga', async () => {
  const resposta = await fetch(`${base}/`);
  assert.equal(resposta.status, 200);
  const html = await resposta.text();
  assert.match(html, /<footer>/);
  assert.match(html, /Botiga Copilot · Carrer Major, 123/);
  assert.match(html, /<a href="mailto:contacte@botigacopilot\.cat">Contacta'ns<\/a>/);
});
