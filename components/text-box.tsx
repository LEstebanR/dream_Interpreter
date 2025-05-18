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
      <div className="w-full relative">
        <Textarea
          placeholder="Describe tu sueño aquí..."
          className="w-full min-h-[6rem] max-h-[12rem] border-2 border-secondary/20 rounded-2xl p-4 pb-16 focus:border-primary/50 focus:ring-0 transition-colors duration-200 bg-background/50 backdrop-blur-sm shadow-sm overflow-y-auto"
          value={dream}
          onChange={(e) => {
            setDream(e.target.value);
          }}
          readOnly={!!interpretation}
        />
        <div className="absolute bottom-1 right-1 z-10 bg-background/50 backdrop-blur-sm rounded-full">
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
