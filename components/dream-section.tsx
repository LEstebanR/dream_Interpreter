"use client";
import { useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { motion, AnimatePresence } from "framer-motion";
import TextBox from "./text-box";

export function DreamSection({ subtitle }: { subtitle: string }) {
  const [interpretation, setInterpretation] = useState("");

  return (
    <>
      {/* subtitle / interpretation */}
      <div
        className="w-full flex justify-center mt-2 opacity-0"
        style={{ animation: "fade-up 0.6s ease-out 0.3s both" }}
      >
        <AnimatePresence mode="wait">
          {interpretation ? (
            <motion.div
              key="interpretation"
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative max-w-2xl w-full mx-auto rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm px-6 py-5"
            >
              <div className="absolute top-0 left-0 w-16 h-16 rounded-tl-2xl bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
              <p className="relative text-base md:text-lg text-foreground/80 leading-relaxed text-center">
                <TypeAnimation
                  sequence={[interpretation]}
                  wrapper="span"
                  speed={80}
                  cursor={false}
                  repeat={0}
                />
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-lg md:text-xl text-center text-muted-foreground/70 max-w-md"
            >
              {subtitle}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* textbox */}
      <div
        className="w-full flex justify-center opacity-0"
        style={{ animation: "fade-up 0.6s ease-out 0.45s both" }}
      >
        <TextBox
          interpretation={interpretation}
          setInterpretation={setInterpretation}
        />
      </div>
    </>
  );
}
