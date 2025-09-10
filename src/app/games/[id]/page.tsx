"use client";

// react / next
import React, {
  useEffect,
  useState,
} from "react";

// store
import { storeGameLib } from "@/store/gameLibraryStore";
import { useGameSettingsStore } from "@/store/gameSettingsStore";

// components
import { Button } from "@/components/ui/button";
import GameRule from "@/components/ui/gameRule";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DialogDeleteConfirm from "@/components/utils/DeleteDialogConfirm";

export default function GameByID({ params }: { params: { id: string } }) {
  const id = params.id;
  const router = useRouter();
  const [errMsg, setErrMsg] = useState("");

  const { gameLib, removeGame } = storeGameLib((state) => state);
  const { game, updateGameState } = useGameSettingsStore((state) => state);
  const findGame = gameLib.get(id);

  useEffect(() => {
    findGame
      ? updateGameState(findGame)
      : setErrMsg("Sorry, we could not find the game you are looking for");
  }, [findGame, router, updateGameState, errMsg]);

  function handleRemoveGame() {
    try {
      if (!id) throw "no id to find the game to delete";
      if (!game) throw "no game to delete";
      removeGame(id);
    } catch (error) {
      toast.error("could not delete game");
      console.error(error);
      return;
    }
    toast.success("Deleted game", { className: "!bg-green-300" });
    router.replace("/games");
  }

  return !errMsg ? (
    <main className="py-8 px-4 mx-auto max-w-xl flex flex-col flex-1">
      <div className="flex flex-wrap justify-between">
        <h1 className="font-lucky text-4xl mt-1">{game.title}</h1>
        <Link href={"/games/create?id=" + id}>
          <Button variant={"outline"}>Edit</Button>
        </Link>
      </div>

      {id && (
        <DialogDeleteConfirm
          onConfirm={handleRemoveGame}
          confirmQueryString="Are you sure you want to permanently delete this game?"
          confirmString="Yes, i want to delete this game!"
        >
          <Button variant={"destructive"} className="absolute top-2 right-2">
            Delete game
          </Button>
        </DialogDeleteConfirm>
      )}

      <section className="mt-12 flex flex-col justify-center">
        <h2 className="font-lucky text-2xl">Game rules</h2>

        <div className="flex flex-col gap-2 my-2">
          {Object.entries(game.options).map(
            ([rule, { active, conditions }], index) =>
              active && (
                <GameRule
                  key={index}
                  rule={rule}
                  conditions={conditions}
                  editable={false}
                ></GameRule>
              )
          )}
        </div>
      </section>
      <div className="mt-8 mb-4 flex justify-center">
        <Link href={"/tables/create?game=" + game.id}>
          <Button>Create a table!</Button>
        </Link>
      </div>
    </main>
  ) : (
    <main className="py-8 px-4 mx-auto max-w-md flex flex-col flex-1">
      <>
        <h2 className="text-3xl font-lucky">
          Hmmm, it seems something went wrong
        </h2>
        <p>{errMsg}</p>

        <div className="flex gap-2 ">
          <Link href={"/games"} className="mt-8 ">
            <Button variant={"secondary"}>Back to games page</Button>
          </Link>
          <Link href={"/games/create"} className="mt-8 ">
            <Button>Create a new game</Button>
          </Link>
        </div>
      </>
    </main>
  );
}
