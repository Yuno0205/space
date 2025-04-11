"use client"

import { useEffect, useRef } from "react"

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create stars
    const stars: {
      x: number
      y: number
      radius: number
      opacity: number
      speed: number
      twinkleSpeed: number
      twinklePhase: number
    }[] = []
    const shootingStars: { x: number; y: number; length: number; speed: number; opacity: number; angle: number }[] = []

    // Create stars with twinkling effect
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random(),
        speed: Math.random() * 0.05,
        twinkleSpeed: 0.003 + Math.random() * 0.015,
        twinklePhase: Math.random() * Math.PI * 2,
      })
    }

    // Create occasional shooting star
    const createShootingStar = () => {
      if (shootingStars.length < 3 && Math.random() < 0.01) {
        const angle = Math.PI / 4 + (Math.random() * Math.PI) / 2
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height / 3),
          length: 50 + Math.random() * 100,
          speed: 5 + Math.random() * 10,
          opacity: 0.7 + Math.random() * 0.3,
          angle: angle,
        })
      }
    }

    // Create nebula clouds
    const nebulae: { x: number; y: number; radius: number; color: string; opacity: number }[] = []
    for (let i = 0; i < 5; i++) {
      nebulae.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 100 + Math.random() * 200,
        color: `hsl(${Math.random() * 60 + 220}, 70%, 50%)`,
        opacity: 0.02 + Math.random() * 0.05,
      })
    }

    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw nebulae
      nebulae.forEach((nebula) => {
        const gradient = ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.radius)
        gradient.addColorStop(0, `${nebula.color.replace(")", `, ${nebula.opacity})`)}`)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.beginPath()
        ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      // Draw stars with twinkling
      stars.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed
        const twinkle = Math.sin(star.twinklePhase) * 0.5 + 0.5

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius * (0.7 + twinkle * 0.3), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * (0.5 + twinkle * 0.5)})`
        ctx.fill()

        // Move stars
        star.y += star.speed

        // Reset stars that go off screen
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
      })

      // Create and animate shooting stars
      createShootingStar()

      // Draw shooting stars
      ctx.lineCap = "round"
      shootingStars.forEach((star, index) => {
        ctx.beginPath()
        ctx.moveTo(star.x, star.y)
        ctx.lineTo(star.x - Math.cos(star.angle) * star.length, star.y + Math.sin(star.angle) * star.length)

        const gradient = ctx.createLinearGradient(
          star.x,
          star.y,
          star.x - Math.cos(star.angle) * star.length,
          star.y + Math.sin(star.angle) * star.length,
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.stroke()

        // Move shooting star
        star.x += Math.cos(star.angle) * star.speed
        star.y -= Math.sin(star.angle) * star.speed

        // Remove if off screen
        if (
          star.x < -star.length ||
          star.x > canvas.width + star.length ||
          star.y < -star.length ||
          star.y > canvas.height + star.length
        ) {
          shootingStars.splice(index, 1)
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" aria-hidden="true" />
  )
}
