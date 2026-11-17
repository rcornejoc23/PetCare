import { useEffect, useState } from 'react'
import { Campo } from './Ui.jsx'
import { aInputDateTime, aLocalDateTime } from '../utils.js'

const VACIO = { fecha: '', motivo: '', diagnostico: '', costo: '', mascotaId: '' }

// Formulario para registrar o editar una cita.
export default function CitaForm({ cita, mascotas, mascotaInicial, errores, guardando, onGuardar, onCancelar }) {
  const [form, setForm] = useState(VACIO)

  useEffect(() => {
    if (cita) {
      setForm({
        fecha: aInputDateTime(cita.fecha),
        motivo: cita.motivo,
        diagnostico: cita.diagnostico || '',
        costo: String(cita.costo ?? ''),
        mascotaId: String(cita.mascota?.id ?? ''),
      })
    } else {
      setForm({ ...VACIO, mascotaId: mascotaInicial ? String(mascotaInicial) : '' })
    }
  }, [cita, mascotaInicial])

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const enviar = (e) => {
    e.preventDefault()
    onGuardar({
      fecha: aLocalDateTime(form.fecha),
      motivo: form.motivo.trim(),
      diagnostico: form.diagnostico.trim() || null,
      costo: form.costo === '' ? null : Number(form.costo),
      mascota: { id: Number(form.mascotaId) },
    })
  }

  return (
    <form className="card formulario" onSubmit={enviar}>
      <h3>{cita ? `Editar cita #${cita.id}` : 'Registrar cita'}</h3>
      <div className="grid-2">
        <Campo label="Mascota *" error={errores.mascota}>
          <select name="mascotaId" value={form.mascotaId} onChange={cambiar} required>
            <option value="">Seleccione una mascota…</option>
            {mascotas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre} · {m.especie} — dueño: {m.dueno?.nombre}
              </option>
            ))}
          </select>
        </Campo>
        <Campo label="Fecha y hora *" error={errores.fecha}>
          <input name="fecha" type="datetime-local" value={form.fecha} onChange={cambiar} required />
        </Campo>
        <Campo label="Motivo *" error={errores.motivo}>
          <input name="motivo" value={form.motivo} onChange={cambiar} placeholder="Vacuna anual" maxLength={200} required />
        </Campo>
        <Campo label="Costo (CLP) *" error={errores.costo}>
          <input name="costo" type="number" min="0" step="1" value={form.costo} onChange={cambiar} placeholder="25000" required />
        </Campo>
      </div>
      <Campo label="Diagnóstico" error={errores.diagnostico}>
        <textarea name="diagnostico" value={form.diagnostico} onChange={cambiar} rows={3} maxLength={500} placeholder="Sin observaciones" />
      </Campo>
      <div className="acciones">
        <button type="submit" className="btn btn-primario" disabled={guardando || mascotas.length === 0}>
          {guardando ? 'Guardando…' : cita ? 'Guardar cambios' : 'Registrar cita'}
        </button>
        {onCancelar && (
          <button type="button" className="btn" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
