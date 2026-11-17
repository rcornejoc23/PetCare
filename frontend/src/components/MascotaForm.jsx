import { useEffect, useState } from 'react'
import { Campo } from './Ui.jsx'
import { hoy } from '../utils.js'

const VACIO = { nombre: '', especie: '', raza: '', fechaNacimiento: '', duenoId: '' }

// Formulario para crear o editar una mascota. "duenoFijo" se usa cuando
// se registra la mascota desde el detalle de un dueño.
export default function MascotaForm({ mascota, duenos, duenoFijo, errores, guardando, onGuardar, onCancelar }) {
  const [form, setForm] = useState(VACIO)

  useEffect(() => {
    if (mascota) {
      setForm({
        nombre: mascota.nombre,
        especie: mascota.especie,
        raza: mascota.raza || '',
        fechaNacimiento: mascota.fechaNacimiento || '',
        duenoId: String(mascota.dueno?.id ?? ''),
      })
    } else {
      setForm({ ...VACIO, duenoId: duenoFijo ? String(duenoFijo.id) : '' })
    }
  }, [mascota, duenoFijo])

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const enviar = (e) => {
    e.preventDefault()
    onGuardar({
      nombre: form.nombre.trim(),
      especie: form.especie.trim(),
      raza: form.raza.trim() || null,
      fechaNacimiento: form.fechaNacimiento || null,
      dueno: { id: Number(form.duenoId) },
    })
  }

  return (
    <form className="card formulario" onSubmit={enviar}>
      <h3>{mascota ? `Editar mascota #${mascota.id}` : 'Nueva mascota'}</h3>
      <div className="grid-2">
        <Campo label="Nombre *" error={errores.nombre}>
          <input name="nombre" value={form.nombre} onChange={cambiar} placeholder="Firulais" maxLength={100} required />
        </Campo>
        <Campo label="Especie *" error={errores.especie}>
          <input name="especie" value={form.especie} onChange={cambiar} placeholder="Perro" maxLength={50} list="especies" required />
          <datalist id="especies">
            <option value="Perro" />
            <option value="Gato" />
            <option value="Ave" />
            <option value="Conejo" />
            <option value="Hámster" />
          </datalist>
        </Campo>
        <Campo label="Raza" error={errores.raza}>
          <input name="raza" value={form.raza} onChange={cambiar} placeholder="Labrador" maxLength={50} />
        </Campo>
        <Campo label="Fecha de nacimiento" error={errores.fechaNacimiento}>
          <input name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={cambiar} max={hoy()} />
        </Campo>
        <Campo label="Dueño *" error={errores.dueno}>
          {duenoFijo ? (
            <input value={`${duenoFijo.nombre} (${duenoFijo.rut})`} disabled />
          ) : (
            <select name="duenoId" value={form.duenoId} onChange={cambiar} required>
              <option value="">Seleccione un dueño…</option>
              {duenos.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre} ({d.rut})
                </option>
              ))}
            </select>
          )}
        </Campo>
      </div>
      <div className="acciones">
        <button type="submit" className="btn btn-primario" disabled={guardando}>
          {guardando ? 'Guardando…' : mascota ? 'Guardar cambios' : 'Registrar mascota'}
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
