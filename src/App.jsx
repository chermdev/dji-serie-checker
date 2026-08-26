import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowUpRight } from 'lucide-react'
import { HeroPattern } from './components/HeroPattern'
import { SerialChecker } from './components/SerialChecker'

export function App() {
  const heroRef = useRef(null)

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const animation = gsap.context(() => {
      gsap.fromTo(
        '[data-hero-enter]',
        { opacity: 0, y: reduceMotion ? 0 : 14 },
        {
          opacity: 1,
          y: 0,
          duration: reduceMotion ? 0.2 : 0.55,
          stagger: reduceMotion ? 0 : 0.06,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        },
      )
    }, heroRef)

    return () => animation.revert()
  }, [])

  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="Ir al inicio">SERIE / MX</a>
        <a className="header-link" href="#fuente">Ver listado</a>
      </header>

      <main id="inicio">
        <section className="hero-stage" ref={heroRef} aria-labelledby="page-title">
          <HeroPattern hostRef={heroRef} />
          <div className="hero-grid">
            <div className="hero">
              <p className="eyebrow" data-hero-enter>Consulta independiente · México</p>
              <h1 id="page-title" data-hero-enter>Revisa la serie antes de comprar.</h1>
              <p className="hero__intro" data-hero-enter>
                Escanea el código de barras para comprobar si la serie aparece en el listado público.
              </p>
              <p className="hero__privacy" data-hero-enter>
                La consulta ocurre en tu dispositivo. No guardamos la serie ni imágenes de la cámara.
              </p>
            </div>

            <SerialChecker />
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
