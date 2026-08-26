import { useEffect, useRef, useState } from 'react'
import { BrowserCodeReader, BrowserMultiFormatReader } from '@zxing/browser'
import { Camera, X } from 'lucide-react'

export function CameraScanner({ onScan, onClose }) {
  const videoRef = useRef(null)
  const controlsRef = useRef(null)
  const completedRef = useRef(false)
  const [status, setStatus] = useState('Solicitando acceso a la cámara…')

  useEffect(() => {
    const reader = new BrowserMultiFormatReader(undefined, {
      delayBetweenScanAttempts: 250,
    })

    async function start() {
      try {
        const controls = await reader.decodeFromConstraints(
          {
            video: {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          },
          videoRef.current,
          (result) => {
            if (!result || completedRef.current) return
            completedRef.current = true
            controlsRef.current?.stop()
            onScan(result.getText())
          },
        )
        controlsRef.current = controls
        setStatus('Apunta al código de barras de la etiqueta')
      } catch (error) {
        setStatus(
          error?.name === 'NotAllowedError'
            ? 'Permite el acceso a la cámara o escribe la serie manualmente.'
            : 'No fue posible abrir la cámara. Intenta la consulta manual.',
        )
      }
    }

    start()

    return () => {
      controlsRef.current?.stop()
      BrowserCodeReader.releaseAllStreams()
    }
  }, [onScan])

  return (
    <section className="scanner" aria-label="Escáner de código de barras">
      <div className="scanner__header">
        <span className="scanner__label"><Camera size={15} /> Cámara activa</span>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar cámara">
          <X size={18} />
        </button>
      </div>
      <div className="scanner__viewport">
        <video ref={videoRef} muted playsInline aria-label="Vista previa de la cámara" />
        <div className="scan-frame" aria-hidden="true" />
      </div>
      <p className="scanner__status" role="status">{status}</p>
    </section>
  )
}
