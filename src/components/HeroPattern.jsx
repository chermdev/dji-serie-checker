import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function HeroPattern({ hostRef }) {
  const gridRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    const grid = gridRef.current
    const glow = glowRef.current

    if (!host || !grid || !glow) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    const gridX = gsap.quickTo(grid, 'x', { duration: 0.8, ease: 'power3.out' })
    const gridY = gsap.quickTo(grid, 'y', { duration: 0.8, ease: 'power3.out' })
    const glowX = gsap.quickTo(glow, 'x', { duration: 0.6, ease: 'power3.out' })
    const glowY = gsap.quickTo(glow, 'y', { duration: 0.6, ease: 'power3.out' })

    const ambient = gsap.to(grid, {
      scale: 1.025,
      duration: 6,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    })

    function movePattern(event) {
      const bounds = host.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width - 0.5
      const y = (event.clientY - bounds.top) / bounds.height - 0.5

      gridX(x * 18)
      gridY(y * 18)
      glowX(x * 48)
      glowY(y * 36)
    }

    function resetPattern() {
      gridX(0)
      gridY(0)
      glowX(0)
      glowY(0)
    }

    host.addEventListener('pointermove', movePattern, { passive: true })
    host.addEventListener('pointerleave', resetPattern)

    return () => {
      host.removeEventListener('pointermove', movePattern)
      host.removeEventListener('pointerleave', resetPattern)
      ambient.kill()
      gsap.killTweensOf([grid, glow])
    }
  }, [hostRef])

  return (
    <div className="hero-pattern" aria-hidden="true">
      <div className="hero-pattern__grid" ref={gridRef} />
      <div className="hero-pattern__glow" ref={glowRef} />
      <div className="hero-pattern__fade" />
    </div>
  )
}
