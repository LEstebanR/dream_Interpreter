"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Trash } from "lucide-react";
import { useState } from "react";

export default function TextBox({
  interpretation,
  setInterpretation,
}: {
  interpretation: string;
  setInterpretation: (interpretation: string) => void;
}) {
  const [dream, setDream] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInterpret = async () => {
    if (!dream.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/interpret", {
        method: "POST",
        body: JSON.stringify({ dream }),
      });

      const data = await response.json();
      setInterpretation(data.interpretation);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-2 gap-4 justify-self-end">
      <div className="w-full flex flex-col gap-4 p-4 border-2 rounded-xl border-secondary backdrop-blur-sm focus-within:border-secondary">
        <div className="w-full relative max-w-3xl">
          <Textarea
            placeholder="Describe tu sueño aquí..."
            className="w-full min-h-[6rem] max-h-[12rem] rounded-xl border-0 focus:ring-0 py-2 text-lg"
            value={dream}
            onChange={(e) => {
              setDream(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleInterpret();
              }
            }}
            readOnly={!!interpretation}
          />
        </div>
        <div className="w-full flex justify-end items-center">
          {interpretation ? (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full hover:bg-secondary/10 transition-colors"
              onClick={() => {
                setInterpretation("");
                setDream("");
              }}
            >
              <Trash className="w-4 h-4" />
              Borrar sueño
            </Button>
          ) : (
            <Button
              size="sm"
              className="rounded-full bg-primary hover:bg-primary/90 transition-colors"
              onClick={handleInterpret}
              disabled={isLoading || !dream.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Interpretando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
