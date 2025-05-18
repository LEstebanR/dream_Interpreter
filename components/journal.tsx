import {
  BookOpenText,
  Calendar as CalendarIcon,
  MoveLeft,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";

const MOCK_DREAMS = [
  {
    id: 1,
    date: "2025-01-01",
    description:
      "Me perseguía un animal salvaje en un bosque oscuro. Corría desesperadamente pero mis piernas se sentían pesadas y lentas. Justo cuando el animal estaba a punto de alcanzarme, desperté.",
    interpretation:
      "Ser perseguido en un sueño generalmente refleja que estás evitando algo en tu vida consciente. Puede ser un problema, una decisión difícil o una emoción que no quieres enfrentar. El animal salvaje representa una fuerza o emoción primitiva que percibes como amenazante. Podría simbolizar miedos, instintos o impulsos que te resultan difíciles de controlar o aceptar. La sensación de piernas pesadas y lentas es común en sueños de persecución y refleja una sensación de impotencia o frustración ante los desafíos. Sugiere que puedes sentir que no tienes los recursos necesarios para enfrentar lo que te acecha. Despertar justo antes de ser alcanzado indica que aún no estás listo para confrontar directamente este aspecto de tu vida, pero tu subconsciente te está urgiendo a prestarle atención.",
  },
  {
    id: 2,
    date: "2025-01-02",
    description:
      "Me perseguía un animal salvaje en un bosque oscuro. Corría desesperadamente pero mis piernas se sentían pesadas y lentas. Justo cuando el animal estaba a punto de alcanzarme, desperté.",
    interpretation:
      "Ser perseguido en un sueño generalmente refleja que estás evitando algo en tu vida consciente. Puede ser un problema, una decisión difícil o una emoción que no quieres enfrentar. El animal salvaje representa una fuerza o emoción primitiva que percibes como amenazante. Podría simbolizar miedos, instintos o impulsos que te resultan difíciles de controlar o aceptar. La sensación de piernas pesadas y lentas es común en sueños de persecución y refleja una sensación de impotencia o frustración ante los desafíos. Sugiere que puedes sentir que no tienes los recursos necesarios para enfrentar lo que te acecha. Despertar justo antes de ser alcanzado indica que aún no estás listo para confrontar directamente este aspecto de tu vida, pero tu subconsciente te está urgiendo a prestarle atención.",
  },
];

const DreamCard = ({ dream }: { dream: (typeof MOCK_DREAMS)[0] }) => {
  return (
    <div className="flex flex-col  w-full gap-2 border-2 rounded-md p-2 ">
      <p className="text-sm font-bold text-ellipsis">{dream.description}</p>
      <span className="text-gray-500 text-sm flex items-center gap-2">
        <CalendarIcon className="w-4 h-4" />
        {dream.date}
      </span>
      <p>{dream.interpretation}</p>
      <Button
        variant="ghost"
        className="flex items-center gap-2 text-red-500 self-end"
      >
        <Trash2 />
      </Button>
    </div>
  );
};

export default function Journal({
  setShowJournal,
}: {
  showJournal: boolean;
  setShowJournal: (showJournal: boolean) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-2">
      <div className="w-full flex justify-between items-center ">
        <span className=" flex items-center gap-2 text-gray-500 text-sm">
          <BookOpenText className="w-4 h-4" />
          My journal
        </span>
        <Button
          variant="ghost"
          className=" flex items-center gap-2"
          onClick={() => setShowJournal(false)}
        >
          <MoveLeft /> Back
        </Button>
      </div>
      <p className="w-full">
        Your personal record of dreams and interpretations
      </p>
      <div className="flex flex-col items-center justify-center w-full gap-2">
        {MOCK_DREAMS.map((dream) => (
          <DreamCard key={dream.id} dream={dream} />
        ))}
      </div>
    </div>
  );
}
