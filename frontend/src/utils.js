// Funciones de formato compartidas por los componentes.

const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })

export const formatearCosto = (valor) => (valor == null ? '—' : clp.format(valor))

// "2020-05-10" -> "10-05-2020"
export const formatearFecha = (iso) => {
  if (!iso) return '—'
  const [a, m, d] = iso.split('-')
  return `${d}-${m}-${a}`
}

// "2026-11-20T10:30:00" -> "20-11-2026 10:30"
export const formatearFechaHora = (iso) => {
  if (!iso) return '—'
  const [fecha, hora = ''] = iso.split('T')
  return `${formatearFecha(fecha)} ${hora.slice(0, 5)}`
}

// El input datetime-local entrega "2026-11-20T10:30"; el backend espera segundos.
export const aLocalDateTime = (valor) => (valor && valor.length === 16 ? `${valor}:00` : valor)

// "2026-11-20T10:30:00" -> "2026-11-20T10:30" para cargar el input al editar
export const aInputDateTime = (valor) => (valor ? valor.slice(0, 16) : '')

export const hoy = () => new Date().toISOString().slice(0, 10)

export function iconoEspecie(especie = '') {
  const e = especie.toLowerCase()
  if (e.includes('perr')) return '🐶'
  if (e.includes('gat')) return '🐱'
  if (e.includes('ave') || e.includes('pájaro') || e.includes('pajaro')) return '🐦'
  if (e.includes('conej')) return '🐰'
  if (e.includes('hámster') || e.includes('hamster')) return '🐹'
  if (e.includes('pez')) return '🐟'
  return '🐾'
}
