import { useEffect, useState } from 'react'
import { Campo } from './Ui.jsx'

const VACIO = { rut: '', nombre: '', telefono: '', email: '' }

// Formulario para crear o editar un dueño.
export default function DuenoForm({ dueno, errores, guardando, onGuardar, onCancelar }) {
  const [form, setForm] = useState(VACIO)

  useEffect(() => {
    setForm(dueno ? { ...VACIO, ...dueno } : VACIO)
  }, [dueno])

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const enviar = (e) => {
    e.preventDefault()
    onGuardar({
      rut: form.rut.trim(),
      nombre: form.nombre.trim(),
      telefono: form.telefono?.trim() || null,
      email: form.email.trim(),
    })
  }

  return (
    <form className="card formulario" onSubmit={enviar}>
      <h3>{dueno ? `Editar dueño #${dueno.id}` : 'Nuevo dueño'}</h3>
      <div className="grid-2">
        <Campo label="RUT *" error={errores.rut}>
          <input name="rut" value={form.rut} onChange={cambiar} placeholder="12.345.678-5" maxLength={12} required />
        </Campo>
        <Campo label="Nombre *" error={errores.nombre}>
          <input name="nombre" value={form.nombre} onChange={cambiar} placeholder="Ana Pérez" maxLength={150} required />
        </Campo>
        <Campo label="Teléfono" error={errores.telefono}>
          <input name="telefono" value={form.telefono || ''} onChange={cambiar} placeholder="+56912345678" maxLength={20} />
        </Campo>
        <Campo label="Email *" error={errores.email}>
          <input name="email" type="email" value={form.email} onChange={cambiar} placeholder="ana@correo.cl" required />
        </Campo>
      </div>
      <div className="acciones">
        <button type="submit" className="btn btn-primario" disabled={guardando}>
          {guardando ? 'Guardando…' : dueno ? 'Guardar cambios' : 'Registrar dueño'}
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
