import { lazy, Suspense, useCallback, useState } from 'react'
import { ArrowUpRight, Camera, Search } from 'lucide-react'
import { Result } from './components/Result'
import { listedSerials, normalizeSerial, serialSet } from './data/serials'

const CameraScanner = lazy(() =>
  import('./components/CameraScanner').then((module) => ({ default: module.CameraScanner })),
)

export function App() {
  const [value, setValue] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isScanning, setIsScanning] = useState(false)

  const verify = useCallback((rawValue) => {
    const serial = normalizeSerial(rawValue)
    setValue(serial)

    if (serial.length < 8) {
      setError('Escribe o escanea un número de serie válido.')
      setResult(null)
      return
    }

    setError('')
    setResult({
      serial,
      type: serialSet.has(serial) ? 'listed' : 'clear',
    })
    setIsScanning(false)
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    verify(value)
  }

  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="Ir al inicio">SERIE / MX</a>
        <a className="header-link" href="#fuente">Ver listado</a>
      </header>

      <main id="inicio">
        <section className="hero" aria-labelledby="page-title">
          <p className="eyebrow">Consulta independiente · México</p>
          <h1 id="page-title">Revisa la serie antes de comprar.</h1>
          <p className="hero__intro">
            Escanea el código de barras o escribe la serie para comprobar si aparece en el listado público de productos reportados como robados.
          </p>
        </section>

        <section className="checker" aria-labelledby="checker-title">
          <div className="section-heading">
            <div>
              <p className="step">Consulta</p>
              <h2 id="checker-title">Número de serie</h2>
            </div>
            <span>{listedSerials.length} series en la lista</span>
          </div>

          <form className="serial-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="serial">Serie del producto</label>
            <div className="input-row">
              <input
                id="serial"
                name="serial"
                type="text"
                value={value}
                onChange={(event) => {
                  setValue(event.target.value.toUpperCase())
                  setError('')
                }}
                placeholder="Ej. ANG5P5D001L06P"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck="false"
                aria-describedby={error ? 'serial-error' : 'serial-help'}
              />
              <button className="button button--primary" type="submit">
                <Search size={17} /> Verificar
              </button>
            </div>
            <div className="form-meta">
              <p id="serial-help">La consulta ocurre en tu dispositivo. No guardamos la serie.</p>
              <button
                className="camera-trigger"
                type="button"
                onClick={() => setIsScanning(true)}
              >
                <Camera size={17} /> Escanear con cámara
              </button>
            </div>
            {error && <p className="form-error" id="serial-error" role="alert">{error}</p>}
          </form>

          {isScanning && (
            <Suspense fallback={<p className="scanner-loading" role="status">Preparando cámara…</p>}>
              <CameraScanner onScan={verify} onClose={() => setIsScanning(false)} />
            </Suspense>
          )}

          <Result result={result} />
        </section>

        <section className="context-section" aria-labelledby="context-title">
          <div className="context-copy">
            <p className="step">Contexto</p>
            <h2 id="context-title">¿Por qué existe esta consulta?</h2>
          </div>
          <div className="context-details">
            <p>
              DJI Store México informó públicamente sobre el robo de un cargamento con drones,
              cámaras y accesorios después de su salida del AIFA. También compartió las series
              involucradas y pidió evitar la compra o comercialización de esos productos.
            </p>
            <p>
              Este sitio convierte ese listado visual en una consulta rápida. Para conocer el
              comunicado original, revisa las publicaciones compartidas por DJI Store México.
            </p>
            <nav className="official-links" aria-label="Publicaciones oficiales de referencia">
              <a
                href="https://www.facebook.com/share/p/19Uh6uZjeH/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Publicación en Facebook <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a
                href="https://www.instagram.com/p/DccyFUBDR-A"
                target="_blank"
                rel="noopener noreferrer"
              >
                Publicación en Instagram <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </nav>
          </div>
        </section>

        <section className="source-section" id="fuente" aria-labelledby="source-title">
          <div className="section-heading section-heading--source">
            <div>
              <p className="step">Fuente visual</p>
              <h2 id="source-title">Productos involucrados</h2>
            </div>
            <a
              href="/productos-involucrados.webp"
              target="_blank"
              rel="noreferrer"
            >
              Abrir imagen <ArrowUpRight size={15} />
            </a>
          </div>
          <figure className="source-image">
            <img
              src="/productos-involucrados.webp"
              alt="Imagen pública con seis columnas de números de serie de productos involucrados"
              loading="lazy"
            />
            <figcaption>
              Imagen proporcionada como referencia. La lista fue transcrita para permitir la consulta.
            </figcaption>
          </figure>
        </section>

        <aside className="notice" aria-labelledby="notice-title">
          <p className="step">Aviso</p>
          <h2 id="notice-title">Sitio independiente y sin fines de lucro.</h2>
          <p>
            Este sitio es ajeno a DJI y a sus distribuidores; no está afiliado, patrocinado ni respaldado por ellos. Fue creado únicamente para facilitar la consulta del listado compartido públicamente. El resultado es informativo y no sustituye una validación oficial. El uso del sitio y cualquier decisión tomada a partir de él son responsabilidad de cada persona.
          </p>
        </aside>
      </main>

      <footer>
        <span>Herramienta comunitaria · 2026</span>
        <a href="https://github.com/chermdev" target="_blank" rel="noreferrer">
          Creado por chermdev <ArrowUpRight size={14} />
        </a>
      </footer>
    </>
  )
}
