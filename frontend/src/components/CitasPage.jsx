import { useCallback, useEffect, useState } from 'react'
import { citasApi, mascotasApi } from '../api.js'
import { formatearCosto, formatearFechaHora } from '../utils.js'
import CitaForm from './CitaForm.jsx'
import { Vacio } from './Ui.jsx'

// Registro de citas (formulario) + CRUD de todas las citas.
export default function CitasPage({ notificar }) {
  const [citas, setCitas] = useState([])
  const [mascotas, setMascotas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [editando, setEditando] = useState(null)
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)
  // Cambiar la key reinicia el formulario de "nueva cita" después de guardar
  const [formKey, setFormKey] = useState(0)

  const cargar = useCallback(async () => {
    try {
      const [c, m] = await Promise.all([citasApi.listar(), mascotasApi.listar()])
      setCitas(c.sort((a, b) => b.fecha.localeCompare(a.fecha)))
      setMascotas(m)
    } catch (e) {
      notificar('error', e.message)
    } finally {
      setCargando(false)
    }
  }, [notificar])

  useEffect(() => {
    cargar()
  }, [cargar])

  const guardar = async (datos) => {
    setGuardando(true)
    setErrores({})
    try {
      if (editando) {
        await citasApi.actualizar(editando.id, datos)
        notificar('ok', `Cita #${editando.id} actualizada`)
        setEditando(null)
      } else {
        const c = await citasApi.crear(datos)
        notificar('ok', `Cita registrada para ${c.mascota?.nombre}`)
        setFormKey((k) => k + 1)
      }
      cargar()
    } catch (e) {
      setErrores(e.campos)
      notificar('error', e.message)
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async (c) => {
    if (!confirm(`¿Eliminar la cita "${c.motivo}" de ${c.mascota?.nombre}?`)) return
    try {
      await citasApi.eliminar(c.id)
      notificar('ok', 'Cita eliminada')
      if (editando?.id === c.id) setEditando(null)
      cargar()
    } catch (e) {
      notificar('error', e.message)
    }
  }

  const total = citas.reduce((s, c) => s + Number(c.costo || 0), 0)

  return (
    <div className="layout-2">
      <section>
        <h2>{editando ? 'Editar cita' : 'Nueva cita'}</h2>
        {!cargando && mascotas.length === 0 && <Vacio>Primero registra una mascota.</Vacio>}
        <CitaForm
          key={editando ? `e${editando.id}` : `n${formKey}`}
          cita={editando}
          mascotas={mascotas}
          errores={errores}
          guardando={guardando}
          onGuardar={guardar}
          onCancelar={
            editando
              ? () => {
                  setErrores({})
                  setEditando(null)
                }
              : null
          }
        />
      </section>

      <section>
        <div className="cabecera">
          <h2>Citas ({citas.length})</h2>
          {citas.length > 0 && <span className="muted">Total: {formatearCosto(total)}</span>}
        </div>
        {cargando ? (
          <Vacio>Cargando…</Vacio>
        ) : citas.length === 0 ? (
          <Vacio>Aún no hay citas registradas.</Vacio>
        ) : (
          <ul className="lista">
            {citas.map((c) => (
              <li key={c.id} className={`item cita ${editando?.id === c.id ? 'item-activo' : ''}`}>
                <div className="item-principal estatico">
                  <strong>
                    {c.motivo} <span className="muted">· {c.mascota?.nombre}</span>
                  </strong>
                  <span className="muted">
                    {formatearFechaHora(c.fecha)} · {formatearCosto(c.costo)} · dueño: {c.mascota?.dueno?.nombre}
                  </span>
                  {c.diagnostico && <span className="diagnostico">{c.diagnostico}</span>}
                </div>
                <div className="item-acciones">
                  <button
                    className="btn btn-chico"
                    onClick={() => {
                      setErrores({})
                      setEditando(c)
                    }}
                  >
                    Editar
                  </button>
                  <button className="btn btn-chico btn-peligro" onClick={() => eliminar(c)}>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
