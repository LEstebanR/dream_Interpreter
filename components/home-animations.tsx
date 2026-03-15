"use client";

import React from "react";
import { motion } from "framer-motion";

const item = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function HomeAnimations({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={item} transition={{ duration: 0.55, ease: "easeOut" }}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
