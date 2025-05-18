import { BookOpenText, MoveLeft } from "lucide-react";
import { Button } from "./ui/button";

export default function Journal({
  setShowJournal,
}: {
  showJournal: boolean;
  setShowJournal: (showJournal: boolean) => void;
}) {
  return (
    <div className="flex flex-col items-start justify-center w-full">
      <div className="w-full flex justify-between items-center ">
        <Button
          variant="ghost"
          className=" flex items-center gap-2 text-bold"
          disabled
        >
          <BookOpenText />
          My journal
        </Button>
        <Button
          variant="ghost"
          className=" flex items-center gap-2"
          onClick={() => setShowJournal(false)}
        >
          <MoveLeft /> Back
        </Button>
      </div>
      <p>Your personal record of dreams and interpretations</p>
    </div>
  );
}
