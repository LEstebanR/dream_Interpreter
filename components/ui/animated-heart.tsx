"use client";
import { motion } from "framer-motion";

export function AnimatedHeart() {
  return (
    <motion.span
      animate={{ scale: [1, 1.4, 1] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      className="inline-flex text-red-400"
    >
      ♥
    </motion.span>
  );
}
