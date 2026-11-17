// Componentes pequeños reutilizables.

export function Mensaje({ mensaje, onCerrar }) {
  if (!mensaje) return null
  return (
    <div className={`mensaje mensaje-${mensaje.tipo}`} role="alert">
      <span>{mensaje.texto}</span>
      <button type="button" className="btn-cerrar" onClick={onCerrar} aria-label="Cerrar">
        ×
      </button>
    </div>
  )
}

// Campo de formulario con su etiqueta y el error que devuelve la API para ese campo.
export function Campo({ label, error, children }) {
  return (
    <label className={`campo ${error ? 'campo-error' : ''}`}>
      <span>{label}</span>
      {children}
      {error && <small>{error}</small>}
    </label>
  )
}

export function Vacio({ children }) {
  return <p className="vacio">{children}</p>
}
