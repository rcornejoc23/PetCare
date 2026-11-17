// Capa de acceso a la API REST de PetCare (Spring Boot) usando fetch.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// Error con el formato que devuelve el GlobalExceptionHandler del backend:
// { status, error, campos? }
export class ApiError extends Error {
  constructor(status, message, campos) {
    super(message)
    this.status = status
    this.campos = campos || {}
  }
}

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(API_URL + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new ApiError(0, `No se pudo conectar con la API (${API_URL}). ¿Está corriendo el backend?`)
  }

  if (res.status === 204) return null

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new ApiError(res.status, data?.error || `Error ${res.status}`, data?.campos)
  }
  return data
}

const get = (path) => request(path)
const post = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) })
const put = (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) })
const del = (path) => request(path, { method: 'DELETE' })

export const duenosApi = {
  listar: () => get('/api/duenos'),
  obtener: (id) => get(`/api/duenos/${id}`),
  mascotas: (id) => get(`/api/duenos/${id}/mascotas`),
  crear: (dueno) => post('/api/duenos', dueno),
  actualizar: (id, dueno) => put(`/api/duenos/${id}`, dueno),
  eliminar: (id) => del(`/api/duenos/${id}`),
}

export const mascotasApi = {
  listar: () => get('/api/mascotas'),
  obtener: (id) => get(`/api/mascotas/${id}`),
  citas: (id) => get(`/api/mascotas/${id}/citas`),
  crear: (mascota) => post('/api/mascotas', mascota),
  actualizar: (id, mascota) => put(`/api/mascotas/${id}`, mascota),
  eliminar: (id) => del(`/api/mascotas/${id}`),
}

export const citasApi = {
  listar: () => get('/api/citas'),
  obtener: (id) => get(`/api/citas/${id}`),
  crear: (cita) => post('/api/citas', cita),
  actualizar: (id, cita) => put(`/api/citas/${id}`, cita),
  eliminar: (id) => del(`/api/citas/${id}`),
}
