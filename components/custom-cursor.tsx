'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const [isMobile, setIsMobile] = useState(false)
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const pointerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: none), (pointer: coarse), (max-width: 768px)')

    const updateDeviceType = () => {
      setIsMobile(mediaQuery.matches)
    }

    const updatePosition = (e: MouseEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY }

      if (frameRef.current !== null) {
        return
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null

        if (!cursorRef.current) {
          return
        }

        cursorRef.current.style.transform = `translate3d(${pointerRef.current.x - 12}px, ${pointerRef.current.y - 12}px, 0)`
      })
    }

    updateDeviceType()
    window.addEventListener('mousemove', updatePosition)
    mediaQuery.addEventListener('change', updateDeviceType)

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      mediaQuery.removeEventListener('change', updateDeviceType)
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  if (isMobile) {
    return null
  }

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-50 transition-none"
      style={{
        mixBlendMode: 'difference',
        willChange: 'transform',
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-80"
      >
        <circle cx="12" cy="12" r="10" fill="white" opacity="0.9"/>
        <path d="M9 10h.01" fill="black"/>
        <path d="M15 10h.01" fill="black"/>
        <path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" fill="black"/>
      </svg>
    </div>
  )
}
