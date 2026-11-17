import { useCallback, useEffect, useState } from 'react'
import { duenosApi, mascotasApi } from '../api.js'
import { formatearFecha, iconoEspecie } from '../utils.js'
import MascotaForm from './MascotaForm.jsx'
import { Vacio } from './Ui.jsx'

// CRUD completo de mascotas.
export default function MascotasPage({ notificar }) {
  const [mascotas, setMascotas] = useState([])
  const [duenos, setDuenos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [form, setForm] = useState(null)
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)

  const cargar = useCallback(async () => {
    try {
      const [m, d] = await Promise.all([mascotasApi.listar(), duenosApi.listar()])
      setMascotas(m)
      setDuenos(d)
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
      if (form?.id) {
        const m = await mascotasApi.actualizar(form.id, datos)
        notificar('ok', `Mascota "${m.nombre}" actualizada`)
      } else {
        const m = await mascotasApi.crear(datos)
        notificar('ok', `Mascota "${m.nombre}" registrada`)
      }
      setForm(null)
      cargar()
    } catch (e) {
      setErrores(e.campos)
      notificar('error', e.message)
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async (m) => {
    if (!confirm(`¿Eliminar la mascota "${m.nombre}"?`)) return
    try {
      await mascotasApi.eliminar(m.id)
      notificar('ok', `Mascota "${m.nombre}" eliminada`)
      cargar()
    } catch (e) {
      notificar('error', e.message)
    }
  }

  const abrirForm = (m) => {
    setErrores({})
    setForm(m)
  }

  return (
    <section>
      <div className="cabecera">
        <h2>Mascotas</h2>
        <button className="btn btn-primario" onClick={() => abrirForm({})} disabled={duenos.length === 0}>
          + Nueva mascota
        </button>
      </div>
      {!cargando && duenos.length === 0 && (
        <Vacio>Primero registra un dueño en la pestaña “Dueños”.</Vacio>
      )}

      {form && (
        <MascotaForm
          mascota={form.id ? form : null}
          duenos={duenos}
          errores={errores}
          guardando={guardando}
          onGuardar={guardar}
          onCancelar={() => setForm(null)}
        />
      )}

      {cargando ? (
        <Vacio>Cargando…</Vacio>
      ) : mascotas.length === 0 ? (
        <Vacio>Aún no hay mascotas registradas.</Vacio>
      ) : (
        <div className="card tabla-scroll">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Especie</th>
                <th>Raza</th>
                <th>Nacimiento</th>
                <th>Dueño</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {mascotas.map((m) => (
                <tr key={m.id}>
                  <td>
                    {iconoEspecie(m.especie)} <strong>{m.nombre}</strong>
                  </td>
                  <td>{m.especie}</td>
                  <td>{m.raza || '—'}</td>
                  <td className="nowrap">{formatearFecha(m.fechaNacimiento)}</td>
                  <td>{m.dueno?.nombre}</td>
                  <td className="nowrap derecha">
                    <button className="btn btn-chico" onClick={() => abrirForm(m)}>
                      Editar
                    </button>{' '}
                    <button className="btn btn-chico btn-peligro" onClick={() => eliminar(m)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
