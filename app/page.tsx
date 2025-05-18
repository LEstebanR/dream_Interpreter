"use client";
import Header from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import TextBox from "@/components/text-box";
import { useState } from "react";

export default function Home() {
  const [interpretation, setInterpretation] = useState("");

  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
      <Header />
      <div className="flex flex-col items-center justify-between w-full relative min-h-[calc(100vh-8rem)]">
        <div className="flex-1 flex items-center">
          <div className="flex flex-col items-center gap-4 w-full">
            <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent ">
              Interpretador de sueños
            </h1>
            <div className="flex flex-col items-center justify-center gap-4 md:w-3/6 px-2">
              {interpretation ? (
                <p className="text-md">{interpretation}</p>
              ) : (
                <p className="text-xl text-center text-muted-foreground">
                  Describe tu sueño y descubre su significado
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <TextBox
            interpretation={interpretation}
            setInterpretation={setInterpretation}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
