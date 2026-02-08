'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Simulate loading time (e.g., 2.5 seconds) or wait for actual assets
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Logo Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mb-8"
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-full border-4 border-primary/20 shadow-2xl">
              <Image
                src="/logo.png"
                alt="Thak Trading Loading"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Spinning Ring */}
            <motion.div
              className="absolute -inset-4 rounded-full border-t-4 border-secondary border-r-4 border-r-transparent border-b-4 border-b-transparent border-l-4 border-l-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          {/* Text & Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              <span className="text-primary">THAK</span> Trading
            </h1>
            <p className="text-sm text-muted-foreground uppercase tracking-[0.2em]">
              Premium Import & Export
            </p>
            
            {/* Progress Bar */}
            <div className="w-48 h-1 bg-muted rounded-full overflow-hidden mx-auto mt-6">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
