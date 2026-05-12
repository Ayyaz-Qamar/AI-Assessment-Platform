import { useEffect, useRef } from 'react'

/**
 * Animated Neural Network background.
 * - Canvas-based for smooth perf even with many nodes
 * - Nodes pulse, drift slowly, and connect to nearby nodes with lines
 * - Line opacity scales with distance (closer = stronger connection)
 * - Subtle blue/purple palette so it doesn't fight foreground content
 * - Adapts to dark mode automatically via CSS variable read on draw
 * - Fixed positioned, pointer-events:none → never blocks clicks
 */
export default function NeuralNetwork() {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const nodesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let width = 0
    let height = 0
    let dpr = window.devicePixelRatio || 1

    const NODE_COUNT_BASE = 55      // medium density
    const MAX_DIST = 160            // px — connection radius
    const NODE_RADIUS_MIN = 1.6
    const NODE_RADIUS_MAX = 3.4
    const NODE_SPEED = 0.25         // px per frame — slow, calming
    const PULSE_SPEED = 0.025

    function isDark() {
      return document.documentElement.classList.contains('dark')
    }

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Density scales with viewport area
      const target = Math.max(
        30,
        Math.min(90, Math.floor((width * height) / 22000)),
      )
      seedNodes(target)
    }

    function seedNodes(count) {
      const nodes = []
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * NODE_SPEED,
          vy: (Math.random() - 0.5) * NODE_SPEED,
          r:
            NODE_RADIUS_MIN +
            Math.random() * (NODE_RADIUS_MAX - NODE_RADIUS_MIN),
          phase: Math.random() * Math.PI * 2,
          hueShift: Math.random() * 60, // small color variance
        })
      }
      nodesRef.current = nodes
    }

    function draw() {
      const dark = isDark()
      // Subtle palette
      // Light mode → indigo/violet on near-white-transparent
      // Dark mode → cyan/violet glowing on near-transparent dark
      const baseRGB = dark ? '147, 197, 253' : '99, 102, 241' // sky-300 vs indigo-500
      const lineRGB = dark ? '167, 139, 250' : '139, 92, 246' // violet-400 / violet-500

      ctx.clearRect(0, 0, width, height)

      const nodes = nodesRef.current

      // ----- update positions -----
      for (let n of nodes) {
        n.x += n.vx
        n.y += n.vy
        n.phase += PULSE_SPEED

        // Bounce off edges softly
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
      }

      // ----- draw connections -----
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            // closer = stronger line
            const t = 1 - dist / MAX_DIST
            // pulse intensity travels along the line via averaged phase
            const pulse = 0.55 + 0.45 * Math.sin((a.phase + b.phase) * 0.5)
            const alpha = (dark ? 0.28 : 0.22) * t * pulse
            ctx.strokeStyle = `rgba(${lineRGB}, ${alpha})`
            ctx.lineWidth = 0.9
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // ----- draw nodes (with halo) -----
      for (let n of nodes) {
        const pulse = 0.55 + 0.45 * Math.sin(n.phase)
        const haloAlpha = (dark ? 0.18 : 0.13) * pulse

        // Outer halo
        ctx.beginPath()
        ctx.fillStyle = `rgba(${baseRGB}, ${haloAlpha})`
        ctx.arc(n.x, n.y, n.r * 3.2, 0, Math.PI * 2)
        ctx.fill()

        // Core node
        ctx.beginPath()
        ctx.fillStyle = `rgba(${baseRGB}, ${dark ? 0.85 : 0.7})`
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: 'transparent',
      }}
    />
  )
}