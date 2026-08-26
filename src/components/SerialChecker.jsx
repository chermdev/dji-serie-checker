import { lazy, Suspense, useCallback, useState } from 'react'
import { Camera, Search } from 'lucide-react'
import { listedSerials, normalizeSerial, serialSet } from '../data/serials'
import { Result } from './Result'

const CameraScanner = lazy(() =>
  import('./CameraScanner').then((module) => ({ default: module.CameraScanner })),
)

export function SerialChecker() {
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
    <section className="checker" aria-labelledby="checker-title" data-hero-enter>
      <div className="section-heading">
        <div>
          <p className="step">Consulta</p>
          <h2 id="checker-title">Número de serie</h2>
        </div>
        <span>{listedSerials.length} series</span>
      </div>

      <button
        className="camera-trigger"
        type="button"
        onClick={() => setIsScanning(true)}
      >
        <span><Camera size={20} /> Escanear con cámara</span>
        <span className="camera-trigger__hint">Apunta al código de barras</span>
      </button>

      {isScanning && (
        <Suspense fallback={<p className="scanner-loading" role="status">Preparando cámara…</p>}>
          <CameraScanner onScan={verify} onClose={() => setIsScanning(false)} />
        </Suspense>
      )}

      <div className="manual-divider"><span>O escribe la serie</span></div>

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
        <p className="serial-help" id="serial-help">También puedes copiar y pegar la serie.</p>
        {error && <p className="form-error" id="serial-error" role="alert">{error}</p>}
      </form>

      <Result result={result} />
    </section>
  )
}
