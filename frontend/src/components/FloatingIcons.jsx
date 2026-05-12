import { useMemo } from 'react'

/**
 * Animated floating academic icons (books, pencils, graduation caps, brains, etc.)
 * Designed for Login/Register backgrounds.
 *
 * - Pure CSS animations (no JS loops → great perf)
 * - Each icon gets randomized: position, size, duration, delay, rotation
 * - pointer-events: none → never blocks form clicks
 */
const ICONS = ['📚', '✏️', '🎓', '🧠', '📝', '🔬', '📐', '🖋️', '💡', '🎯', '📖', '🧪', '📊', '🔍', '⚛️']

// MEDIUM intensity: 24 icons, balanced opacity, moderate speed
const COUNT = 24

function randomFloat(min, max) {
  return Math.random() * (max - min) + min
}

export default function FloatingIcons() {
  // Generate icon configs once (memo so they don't re-randomize on parent re-render)
  const items = useMemo(() => {
    return Array.from({ length: COUNT }).map((_, i) => {
      const icon = ICONS[i % ICONS.length]
      const left = randomFloat(0, 100)            // %
      const startTop = randomFloat(60, 110)       // start below visible area for upward float
      const size = randomFloat(22, 48)            // px (medium range)
      const duration = randomFloat(18, 34)        // seconds — slow, calming
      const delay = randomFloat(0, 20)            // start staggered
      const sway = randomFloat(-40, 40)           // px horizontal sway
      const rotateStart = randomFloat(-25, 25)
      const rotateEnd = rotateStart + randomFloat(-180, 180)
      const opacity = randomFloat(0.18, 0.38)     // medium visibility
      return {
        id: i,
        icon,
        left,
        startTop,
        size,
        duration,
        delay,
        sway,
        rotateStart,
        rotateEnd,
        opacity,
      }
    })
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
    >
      {items.map((it) => (
        <span
          key={it.id}
          className="floating-icon"
          style={{
            left: `${it.left}%`,
            top: `${it.startTop}%`,
            fontSize: `${it.size}px`,
            opacity: it.opacity,
            animation: `float-up-${it.id} ${it.duration}s linear ${it.delay}s infinite`,
          }}
        >
          {it.icon}
        </span>
      ))}

      <style>{`
        .floating-icon {
          position: absolute;
          user-select: none;
          will-change: transform, opacity;
          filter: drop-shadow(0 4px 8px rgba(99, 102, 241, 0.15));
        }

        ${items
          .map(
            (it) => `
            @keyframes float-up-${it.id} {
              0% {
                transform: translate(0, 0) rotate(${it.rotateStart}deg);
                opacity: 0;
              }
              10% {
                opacity: ${it.opacity};
              }
              90% {
                opacity: ${it.opacity};
              }
              100% {
                transform: translate(${it.sway}px, -120vh) rotate(${it.rotateEnd}deg);
                opacity: 0;
              }
            }
          `,
          )
          .join('\n')}
      `}</style>
    </div>
  )
}