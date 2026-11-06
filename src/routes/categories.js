import { Router } from 'express';

/**
 * Crea el router de l'endpoint de categories.
 * @param {import('node:sqlite').DatabaseSync} db Connexió a la base de dades.
 * @returns {import('express').Router} Router amb la ruta de categories.
 */
export function routerCategories(db) {
  const router = Router();

  // GET /api/categories
  router.get('/', (req, res) => {
    try {
      const categories = db
        .prepare(
          'SELECT categoria, COUNT(*) AS numProductes FROM productes GROUP BY categoria ORDER BY categoria'
        )
        .all();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'No s’han pogut obtenir les categories' });
    }
  });

  return router;
}
