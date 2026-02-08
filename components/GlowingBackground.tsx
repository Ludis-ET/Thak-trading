'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function GlowingBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-background/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50" />
      
      {/* Moving Particles */}
      {[...Array(20)].map((_, i) => (
        <Particle key={i} index={i} />
      ))}

      {/* Mouse Glow */}
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]"
        animate={{
          x: mousePosition.x - 250,
          y: mousePosition.y - 250,
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 200,
          mass: 0.5,
        }}
      />
    </div>
  )
}

function Particle({ index }: { index: number }) {
  const randomX = Math.random() * 100
  const randomY = Math.random() * 100
  
  return (
    <motion.div
      className="absolute h-1 w-1 rounded-full bg-primary/40"
      style={{
        left: `${randomX}%`,
        top: `${randomY}%`,
      }}
      animate={{
        y: [0, -100, 0],
        x: [0, 50, 0],
        opacity: [0, 0.8, 0],
        scale: [0, 1.5, 0],
      }}
      transition={{
        duration: 10 + Math.random() * 10,
        repeat: Infinity,
        ease: 'linear',
        delay: index * 0.5,
      }}
    />
  )
}
