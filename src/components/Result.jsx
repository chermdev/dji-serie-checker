import { AlertTriangle, Check, Search } from 'lucide-react'

export function Result({ result }) {
  if (!result) {
    return (
      <div className="result result--idle" aria-live="polite">
        <Search size={19} />
        <p>El resultado aparecerá aquí.</p>
      </div>
    )
  }

  if (result.type === 'listed') {
    return (
      <div className="result result--listed" role="alert">
        <AlertTriangle size={21} />
        <div>
          <strong>Esta serie aparece en el listado</strong>
          <p>No compres ni comercialices este producto. Verifica la información con el vendedor y las autoridades correspondientes.</p>
          <code>{result.serial}</code>
        </div>
      </div>
    )
  }

  return (
    <div className="result result--clear" role="status">
      <Check size={21} />
      <div>
        <strong>No aparece en este listado</strong>
        <p>Esto no garantiza que el producto sea legítimo, nuevo o seguro. Revisa también factura, procedencia y vendedor.</p>
        <code>{result.serial}</code>
      </div>
    </div>
  )
}
