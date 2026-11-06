import { Router } from 'express';
import { calcularResumCarret } from '../utils/carret.js';

/**
 * Crea el router dels endpoints del carret de compra.
 * @returns {import('express').Router} Router amb les rutes del carret.
 */
export function routerCarret() {
  const router = Router();

  // POST /api/carret/total  { items: [{ preu, quantitat }], descompte }
  router.post('/total', (req, res) => {
    const { items = [], descompte = 0 } = req.body;
    try {
      res.json(calcularResumCarret(items, descompte));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}
