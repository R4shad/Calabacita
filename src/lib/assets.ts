/**
 * Convierte rutas de `public/` en URLs válidas respetando `base`
 * (para que funcione también en despliegues dentro de un sub-path).
 */
export function assetUrl(path: string): string {
  if (!path) return ''
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  const base = import.meta.env.BASE_URL || '/'
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}