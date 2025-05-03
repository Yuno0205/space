"use client"

import { useState, useEffect, useRef } from "react"
import { useInView } from "framer-motion"

interface CountUpProps {
  end: number
  duration?: number
  delay?: number
  prefix?: string
  suffix?: string
}

export function CountUp({ end, duration = 2, delay = 0, prefix = "", suffix = "" }: CountUpProps) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true)

      // Delay the start of the animation
      const delayTimeout = setTimeout(() => {
        let startTime: number
        let animationFrame: number

        const animate = (timestamp: number) => {
          if (!startTime) startTime = timestamp
          const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)

          setCount(Math.floor(progress * end))

          if (progress < 1) {
            animationFrame = requestAnimationFrame(animate)
          }
        }

        animationFrame = requestAnimationFrame(animate)

        return () => {
          cancelAnimationFrame(animationFrame)
        }
      }, delay * 1000)

      return () => clearTimeout(delayTimeout)
    }
  }, [isInView, end, duration, delay, hasStarted])

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}
