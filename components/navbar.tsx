"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { AnimatedButton } from "@/components/ui/animated-button"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"}`}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/" className="text-xl font-bold">
              SPACE<span className="text-gray-400">EXPLORER</span>
            </Link>
          </motion.div>

          {isMobile ? (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMenuOpen ? <X /> : <Menu />}
                </Button>
              </motion.div>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 top-16 bg-black z-40 p-4"
                  >
                    <motion.nav
                      className="flex flex-col space-y-4"
                      variants={navVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div variants={itemVariants}>
                        <Link
                          href="#"
                          className="text-lg py-2 border-b border-white/10"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Missions
                        </Link>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <Link
                          href="#"
                          className="text-lg py-2 border-b border-white/10"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Gallery
                        </Link>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <Link
                          href="#"
                          className="text-lg py-2 border-b border-white/10"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Research
                        </Link>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <Link
                          href="#"
                          className="text-lg py-2 border-b border-white/10"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          About
                        </Link>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <AnimatedButton className="mt-4 bg-white text-black hover:bg-gray-200">
                          Contact Us
                        </AnimatedButton>
                      </motion.div>
                    </motion.nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <>
              <motion.nav
                className="hidden md:flex items-center space-x-8"
                variants={navVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <Link href="#" className="text-white hover:text-gray-300 transition-colors">
                    Missions
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link href="#" className="text-white hover:text-gray-300 transition-colors">
                    Gallery
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link href="#" className="text-white hover:text-gray-300 transition-colors">
                    Research
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link href="#" className="text-white hover:text-gray-300 transition-colors">
                    About
                  </Link>
                </motion.div>
              </motion.nav>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <AnimatedButton className="hidden md:inline-flex bg-white text-black hover:bg-gray-200">
                  Contact Us
                </AnimatedButton>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.header>
  )
}
