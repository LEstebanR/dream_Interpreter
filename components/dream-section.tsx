"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextBox from "./text-box";

function WordReveal({ text }: { text: string }) {
  const words = text.split(" ");
  const [visibleCount, setVisibleCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setVisibleCount(0);
    intervalRef.current = setInterval(() => {
      setVisibleCount((c) => {
        if (c >= words.length) {
          clearInterval(intervalRef.current!);
          return c;
        }
        return c + 1;
      });
    }, 60);
    return () => clearInterval(intervalRef.current!);
  }, [text]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-300"
          style={{
            opacity: i < visibleCount ? 1 : 0,
            filter: i < visibleCount ? "blur(0px)" : "blur(4px)",
            transform: i < visibleCount ? "translateY(0)" : "translateY(4px)",
            marginRight: "0.25em",
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

export function DreamSection({ subtitle }: { subtitle: string }) {
  const [interpretation, setInterpretation] = useState("");
  const [isPremiumModel, setIsPremiumModel] = useState(false);

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
              {isPremiumModel && (
                <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-medium text-primary/60 select-none">
                  ✨ Claude
                </span>
              )}
              <p className="relative text-base md:text-lg text-foreground/80 leading-relaxed text-center">
                <WordReveal text={interpretation} />
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
          setIsPremiumModel={setIsPremiumModel}
        />
      </div>
    </>
  );
}
