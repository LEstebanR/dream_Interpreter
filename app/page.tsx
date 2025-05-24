"use client";
import TextBox from "@/components/text-box";
import { useState } from "react";
import { TypeAnimation } from "react-type-animation";

export default function Home() {
  const [interpretation, setInterpretation] = useState("");

  return (
    <div className="flex flex-col items-center justify-between w-full relative ">
      <div className="flex-1 flex items-center">
        <div className="flex flex-col items-center gap-4 w-full">
          <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent ">
            Interpretador de sueños
          </h1>
          <div className="flex flex-col items-center justify-center gap-4 md:w-3xl px-2 my-4  ">
            {interpretation ? (
              <p className="text-lg text-muted-foreground ">
                <TypeAnimation
                  sequence={[interpretation]}
                  wrapper="span"
                  speed={75}
                  cursor={true}
                  repeat={0}
                />
              </p>
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
  );
}
