"use client"

import Link from "next/link"
import { GalleryVerticalEnd } from "lucide-react"
import { motion } from "framer-motion"

export function Logo() {
  return (
    <Link href="/">
      <motion.div
        className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-black"
        whileHover={{ rotate: 10 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <GalleryVerticalEnd className="size-4" />
      </motion.div>
    </Link>
  )
}
