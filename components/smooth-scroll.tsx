'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      // Эту функцию easing можно оставить, она стандартная для Lenis
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      
      // Настройки в новых версиях:
      wheelMultiplier: 1,      // Вместо mouseMultiplier
      touchMultiplier: 2,
      infinite: false,
      // smooth: true — УДАЛЕНО (плавность включена по умолчанию)
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      cancelAnimationFrame(rafId) // Хорошая практика — отменять анимацию
    }
  }, [])

  return null
}