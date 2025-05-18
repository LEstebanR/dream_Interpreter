"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpenText, Send } from "lucide-react";
import { useState } from "react";
import Journal from "./journal";

export default function TextBox() {
  const [showJournal, setShowJournal] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center border-2 rounded-md p-4 w-full max-w-xl mx-2 gap-4">
      {showJournal ? (
        <Journal showJournal={showJournal} setShowJournal={setShowJournal} />
      ) : (
        <>
          <Textarea
            placeholder="Describe your dream here... (e.g: I saw a big snake in my dream)"
            className="w-full min-h-[100px] resize-y"
            rows={4}
          />
          <div className="w-full flex justify-between">
            <Button
              variant="ghost"
              className=" flex items-center gap-2"
              onClick={() => setShowJournal(!showJournal)}
            >
              <BookOpenText />
              My journal
            </Button>
            <Button className="rounded-full flex items-center gap-2">
              Interpret dream <Send />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
