import { Router } from 'express';

/**
 * Crea el router dels endpoints de productes.
 * @param {import('node:sqlite').DatabaseSync} db Connexió a la base de dades.
 * @returns {import('express').Router} Router amb les rutes de productes.
 */
export function routerProductes(db) {
  const router = Router();

  // GET /api/productes?categoria=roba
  router.get('/', (req, res) => {
    const { categoria } = req.query;
    let sql = `
      SELECT productes.*,
             ROUND(AVG(ressenyes.puntuacio), 1) AS mitjana,
             COUNT(ressenyes.id) AS numRessenyes
      FROM productes
      LEFT JOIN ressenyes ON ressenyes.producte_id = productes.id
    `;
    const parametres = [];

    if (categoria) {
      sql += ' WHERE productes.categoria = ?';
      parametres.push(categoria);
    }

    sql += ' GROUP BY productes.id';

    const productes = db.prepare(sql).all(...parametres);
    res.json(productes);
  });

  // GET /api/productes/:id
  router.get('/:id', (req, res) => {
    const producte = db
      .prepare('SELECT * FROM productes WHERE id = ?')
      .get(Number(req.params.id));
    if (!producte) {
      return res.status(404).json({ error: 'Producte no trobat' });
    }
    res.json(producte);
  });

  return router;
}
