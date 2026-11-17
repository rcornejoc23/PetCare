import { useCallback, useEffect, useState } from 'react'
import { citasApi, duenosApi, mascotasApi } from '../api.js'
import { formatearCosto, formatearFecha, formatearFechaHora, iconoEspecie } from '../utils.js'
import DuenoForm from './DuenoForm.jsx'
import MascotaForm from './MascotaForm.jsx'
import CitaForm from './CitaForm.jsx'
import { Vacio } from './Ui.jsx'

// Pantalla principal: lista de dueños -> mascotas del dueño -> citas de la mascota.
export default function DuenosPage({ notificar }) {
  const [duenos, setDuenos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  // Formulario de dueño: null = oculto, {} = nuevo, objeto con id = editar
  const [formDueno, setFormDueno] = useState(null)
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)

  const [seleccionado, setSeleccionado] = useState(null)

  const cargar = useCallback(async () => {
    try {
      setDuenos(await duenosApi.listar())
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
      if (formDueno?.id) {
        const actualizado = await duenosApi.actualizar(formDueno.id, datos)
        notificar('ok', `Dueño "${actualizado.nombre}" actualizado`)
        if (seleccionado?.id === actualizado.id) setSeleccionado(actualizado)
      } else {
        const creado = await duenosApi.crear(datos)
        notificar('ok', `Dueño "${creado.nombre}" registrado`)
      }
      setFormDueno(null)
      cargar()
    } catch (e) {
      setErrores(e.campos)
      notificar('error', e.message)
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async (dueno) => {
    if (!confirm(`¿Eliminar al dueño "${dueno.nombre}"?`)) return
    try {
      await duenosApi.eliminar(dueno.id)
      notificar('ok', `Dueño "${dueno.nombre}" eliminado`)
      if (seleccionado?.id === dueno.id) setSeleccionado(null)
      cargar()
    } catch (e) {
      notificar('error', e.message)
    }
  }

  const abrirForm = (dueno) => {
    setErrores({})
    setFormDueno(dueno)
  }

  const filtro = busqueda.trim().toLowerCase()
  const visibles = duenos.filter(
    (d) => !filtro || d.nombre.toLowerCase().includes(filtro) || d.rut.toLowerCase().includes(filtro),
  )

  return (
    <div className="layout-2">
      <section>
        <div className="cabecera">
          <h2>Dueños</h2>
          <button className="btn btn-primario" onClick={() => abrirForm({})}>
            + Nuevo dueño
          </button>
        </div>

        {formDueno && (
          <DuenoForm
            dueno={formDueno.id ? formDueno : null}
            errores={errores}
            guardando={guardando}
            onGuardar={guardar}
            onCancelar={() => setFormDueno(null)}
          />
        )}

        <input
          className="buscador"
          type="search"
          placeholder="Buscar por nombre o RUT…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {cargando ? (
          <Vacio>Cargando…</Vacio>
        ) : visibles.length === 0 ? (
          <Vacio>{duenos.length === 0 ? 'Aún no hay dueños registrados.' : 'Sin resultados.'}</Vacio>
        ) : (
          <ul className="lista">
            {visibles.map((d) => (
              <li key={d.id} className={`item ${seleccionado?.id === d.id ? 'item-activo' : ''}`}>
                <button className="item-principal" onClick={() => setSeleccionado(d)}>
                  <strong>{d.nombre}</strong>
                  <span className="muted">
                    {d.rut} · {d.email}
                    {d.telefono ? ` · ${d.telefono}` : ''}
                  </span>
                </button>
                <div className="item-acciones">
                  <button className="btn btn-chico" onClick={() => abrirForm(d)}>
                    Editar
                  </button>
                  <button className="btn btn-chico btn-peligro" onClick={() => eliminar(d)}>
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        {seleccionado ? (
          <DetalleDueno key={seleccionado.id} dueno={seleccionado} notificar={notificar} />
        ) : (
          <div className="card placeholder">
            <p>Selecciona un dueño para ver sus mascotas y registrar citas.</p>
          </div>
        )}
      </section>
    </div>
  )
}

// Detalle del dueño: sus mascotas (GET /api/duenos/{id}/mascotas) y las citas
// de la mascota elegida (GET /api/mascotas/{id}/citas).
function DetalleDueno({ dueno, notificar }) {
  const [mascotas, setMascotas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mostrarFormMascota, setMostrarFormMascota] = useState(false)
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [mascotaAbierta, setMascotaAbierta] = useState(null)

  const cargar = useCallback(async () => {
    try {
      setMascotas(await duenosApi.mascotas(dueno.id))
    } catch (e) {
      notificar('error', e.message)
    } finally {
      setCargando(false)
    }
  }, [dueno.id, notificar])

  useEffect(() => {
    cargar()
  }, [cargar])

  const guardarMascota = async (datos) => {
    setGuardando(true)
    setErrores({})
    try {
      const creada = await mascotasApi.crear(datos)
      notificar('ok', `Mascota "${creada.nombre}" registrada para ${dueno.nombre}`)
      setMostrarFormMascota(false)
      cargar()
    } catch (e) {
      setErrores(e.campos)
      notificar('error', e.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="card detalle">
      <div className="cabecera">
        <div>
          <h2>{dueno.nombre}</h2>
          <p className="muted">
            RUT {dueno.rut} · {dueno.email}
            {dueno.telefono ? ` · ${dueno.telefono}` : ''}
          </p>
        </div>
        <button className="btn" onClick={() => setMostrarFormMascota((v) => !v)}>
          {mostrarFormMascota ? 'Cerrar' : '+ Agregar mascota'}
        </button>
      </div>

      {mostrarFormMascota && (
        <MascotaForm
          duenos={[]}
          duenoFijo={dueno}
          errores={errores}
          guardando={guardando}
          onGuardar={guardarMascota}
          onCancelar={() => setMostrarFormMascota(false)}
        />
      )}

      <h3>Mascotas ({mascotas.length})</h3>
      {cargando ? (
        <Vacio>Cargando…</Vacio>
      ) : mascotas.length === 0 ? (
        <Vacio>Este dueño no tiene mascotas registradas.</Vacio>
      ) : (
        <ul className="lista">
          {mascotas.map((m) => (
            <li key={m.id} className="mascota">
              <button
                className="item-principal"
                onClick={() => setMascotaAbierta(mascotaAbierta === m.id ? null : m.id)}
                aria-expanded={mascotaAbierta === m.id}
              >
                <strong>
                  {iconoEspecie(m.especie)} {m.nombre}
                </strong>
                <span className="muted">
                  {m.especie}
                  {m.raza ? ` · ${m.raza}` : ''} · nac. {formatearFecha(m.fechaNacimiento)}
                </span>
                <span className="chevron">{mascotaAbierta === m.id ? '▲' : '▼'}</span>
              </button>
              {mascotaAbierta === m.id && <CitasMascota mascota={m} notificar={notificar} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Citas de una mascota + formulario para registrar una nueva.
function CitasMascota({ mascota, notificar }) {
  const [citas, setCitas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)

  const cargar = useCallback(async () => {
    try {
      const data = await mascotasApi.citas(mascota.id)
      setCitas(data.sort((a, b) => b.fecha.localeCompare(a.fecha)))
    } catch (e) {
      notificar('error', e.message)
    } finally {
      setCargando(false)
    }
  }, [mascota.id, notificar])

  useEffect(() => {
    cargar()
  }, [cargar])

  const guardar = async (datos) => {
    setGuardando(true)
    setErrores({})
    try {
      await citasApi.crear(datos)
      notificar('ok', `Cita registrada para ${mascota.nombre}`)
      setMostrarForm(false)
      cargar()
    } catch (e) {
      setErrores(e.campos)
      notificar('error', e.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="citas-mascota">
      <div className="cabecera">
        <h4>Citas de {mascota.nombre}</h4>
        <button className="btn btn-chico btn-primario" onClick={() => setMostrarForm((v) => !v)}>
          {mostrarForm ? 'Cerrar' : '+ Registrar cita'}
        </button>
      </div>

      {mostrarForm && (
        <CitaForm
          mascotas={[mascota]}
          mascotaInicial={mascota.id}
          errores={errores}
          guardando={guardando}
          onGuardar={guardar}
          onCancelar={() => setMostrarForm(false)}
        />
      )}

      {cargando ? (
        <Vacio>Cargando…</Vacio>
      ) : citas.length === 0 ? (
        <Vacio>Sin citas registradas.</Vacio>
      ) : (
        <div className="tabla-scroll">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Motivo</th>
                <th>Diagnóstico</th>
                <th className="num">Costo</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((c) => (
                <tr key={c.id}>
                  <td className="nowrap">{formatearFechaHora(c.fecha)}</td>
                  <td>{c.motivo}</td>
                  <td>{c.diagnostico || '—'}</td>
                  <td className="num">{formatearCosto(c.costo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
