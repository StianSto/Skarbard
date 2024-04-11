import React from "react";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

export default function EndGame({
  setGameIsFinished,
}: {
  setGameIsFinished: (value: boolean) => void;
}) {
  function handleEndGame() {
    setGameIsFinished(true);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>End Game</Button>
      </DialogTrigger>

      <DialogContent className="bg-white text-black sm:mx-4 ">
        <p className="">Are you sure you want to end this game?</p>
        <div className="flex gap-4 justify-between">
          <DialogClose asChild>
            <Button variant={"destructive"}>No</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant={"ghost"} onClick={handleEndGame}>
              Yes, i want to end this game
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
