"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import Journal from "./journal";

export default function TextBox() {
  const [showJournal, setShowJournal] = useState(false);
  const [dream, setDream] = useState("");
  const [interpretation, setInterpretation] = useState("");
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
    <div className="flex flex-col items-center justify-center border-2 rounded-md p-4 w-full max-w-xl mx-2 gap-4">
      {showJournal ? (
        <Journal showJournal={showJournal} setShowJournal={setShowJournal} />
      ) : (
        <>
          <Textarea
            placeholder="Describe tu sueño aquí..."
            className="w-full min-h-[100px] resize-y"
            rows={4}
            value={interpretation || dream}
            onChange={(e) => setDream(e.target.value)}
            readOnly={!!interpretation}
          />
          <div className="w-full flex justify-end">
            {/* <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => setShowJournal(!showJournal)}
            >
              <BookOpenText />
              My journal
            </Button> */}
            {interpretation ? (
              <Button
                variant="outline"
                className="rounded-full flex items-center gap-2"
                onClick={() => {
                  setInterpretation("");
                  setDream("");
                }}
              >
                Nuevo sueño
              </Button>
            ) : (
              <Button
                className="rounded-full flex items-center gap-2"
                onClick={handleInterpret}
                disabled={isLoading || !dream.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Interpretando...
                  </>
                ) : (
                  <>
                    Interpretar sueño <Send />
                  </>
                )}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
