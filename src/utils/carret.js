function validarDescompte(descompte) {
  if (descompte < 0 || descompte > 100) {
    throw new RangeError('El descompte ha de ser entre 0 i 100');
  }
}

function arrodonir(valor) {
  return Math.round(valor * 100) / 100;
}

/**
 * Calcula el resum econòmic del carret aplicant descompte i enviament.
 * @param {Array<{preu: number, quantitat: number, pes?: number}>} items
 * @param {number} descompte Percentatge entre 0 i 100.
 * @returns {{subtotal: number, enviament: number, total: number}}
 * @throws {RangeError} Si el descompte és fora de rang.
 */
export function calcularResumCarret(items, descompte = 0) {
  validarDescompte(descompte);
  let subtotal = 0;
  let pesTotal = 0;

  for (const item of items) {
    subtotal += item.preu * item.quantitat;
    pesTotal += (item.pes ?? 0.5) * item.quantitat;
  }

  subtotal = arrodonir(subtotal * (1 - descompte / 100));

  let enviament = 0;
  if (subtotal <= 50) {
    enviament = pesTotal <= 1 ? 3.9 : pesTotal <= 5 ? 5.9 : 9.9;
  }

  return {
    subtotal,
    enviament,
    total: arrodonir(subtotal + enviament),
  };
}

/**
 * Calcula el total del carret aplicant un descompte percentual.
 * @param {Array<{preu: number, quantitat: number, pes?: number}>} items
 * @param {number} descompte Percentatge entre 0 i 100.
 * @returns {number} Total arrodonit a 2 decimals.
 * @throws {RangeError} Si el descompte és fora de rang.
 */
export function calcularTotal(items, descompte = 0) {
  return calcularResumCarret(items, descompte).subtotal;
}
