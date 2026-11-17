import { useCallback, useEffect, useRef, useState } from 'react'
import DuenosPage from './components/DuenosPage.jsx'
import MascotasPage from './components/MascotasPage.jsx'
import CitasPage from './components/CitasPage.jsx'
import { Mensaje } from './components/Ui.jsx'

const PESTANAS = [
  { id: 'duenos', label: 'Dueños', Componente: DuenosPage },
  { id: 'mascotas', label: 'Mascotas', Componente: MascotasPage },
  { id: 'citas', label: 'Citas', Componente: CitasPage },
]

export default function App() {
  const [pestana, setPestana] = useState('duenos')
  const [mensaje, setMensaje] = useState(null)
  const timer = useRef()

  // Muestra un aviso (ok / error) que se oculta solo después de unos segundos.
  const notificar = useCallback((tipo, texto) => {
    clearTimeout(timer.current)
    setMensaje({ tipo, texto })
    timer.current = setTimeout(() => setMensaje(null), tipo === 'error' ? 7000 : 3500)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  const { Componente } = PESTANAS.find((p) => p.id === pestana)

  return (
    <>
      <header className="topbar">
        <div className="contenedor topbar-inner">
          <h1>
            <span aria-hidden="true">🐾</span> PetCare
          </h1>
          <nav className="tabs">
            {PESTANAS.map((p) => (
              <button
                key={p.id}
                className={`tab ${pestana === p.id ? 'tab-activa' : ''}`}
                onClick={() => setPestana(p.id)}
              >
                {p.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="contenedor">
        <Mensaje mensaje={mensaje} onCerrar={() => setMensaje(null)} />
        <Componente notificar={notificar} />
      </main>
    </>
  )
}
