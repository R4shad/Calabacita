/**
 * Bloqueo global de navegación.
 * Lo usa el visor de imágenes para que las flechas del teclado
 * no pasen a la carta mientras hay una foto abierta.
 */
let locked = false

export function setNavLock(value: boolean) {
  locked = value
}

export function isNavLocked(): boolean {
  return locked
}