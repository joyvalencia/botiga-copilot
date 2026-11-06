# Botiga Copilot

Mini-botiga en línia per practicar la programació assistida amb GitHub Copilot.

## Requisits

- Node.js 22.13 o superior (recomanat: Node.js 24 LTS)

## Instal·lació i execució

```bash
npm install
npm start
```

Obre <http://localhost:3000> al navegador.

## Tests

```bash
npm test
```

L'ordre executa tots els tests amb el runner integrat de Node.js.

## API

### Productes

- `GET /api/productes`: retorna tots els productes amb la puntuació mitjana i el nombre de ressenyes. Accepta el paràmetre opcional `categoria` per filtrar-los, per exemple `GET /api/productes?categoria=roba`.
- `GET /api/productes/:id`: retorna un producte pel seu identificador o un error 404 si no existeix.

### Categories

- `GET /api/categories`: retorna les categories existents i el nombre de productes de cadascuna.

### Ressenyes

- `GET /api/ressenyes?producteId=1`: retorna les ressenyes del producte indicat, ordenades de més nova a més antiga.
- `POST /api/ressenyes`: crea una ressenya amb les dades del producte, l'autor, el text i la puntuació, i retorna l'identificador creat.

### Carret

- `POST /api/carret/total`: calcula el subtotal després del descompte, el cost d'enviament segons el pes i el total final. Rep `items` i `descompte` al cos de la petició.

## Estructura

```
src/
  index.js          Punt d'entrada: inicia el servidor
  app.js            Configuració d'Express i rutes
  config.js         Configuració de l'aplicació
  db.js             Base de dades SQLite en memòria amb dades de prova
  routes/           Rutes de l'API
  utils/carret.js   Càlcul del total del carret
public/             Frontend (HTML, CSS i JavaScript)
test/               Tests amb el runner integrat de Node.js
docs/               Documentació de proveïdors externs
```
