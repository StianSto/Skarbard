"use client";

// react / next
import React, { useEffect } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";

// store
import { storeGameLib } from "@/store/gameLibraryStore";
import { useGameSettingsStore } from "@/store/gameSettingsStore";

// types and variable imports
import { defaultSettings } from "@/lib/functions/gamelogic/defaultSettings";

// components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GameRule from "@/components/ui/gameRule";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import createRuleString from "@/lib/functions/utils/createRuleString";

// utils
import { v4 as uuidv4 } from "uuid";
import dynamic from "next/dynamic";


function CreateGame() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const idParam = searchParams?.get("id");

  const { gameLib, addGame, removeGame } = storeGameLib((state) => state);
  const gameExists = gameLib.get(idParam || "");
  const { game, updateRule, updateTitle, updateGameState } =
    useGameSettingsStore((state) => state);

  let deleteGameMessage = null;

  function handleRemoveGame() {
    if (idParam && gameExists) {
      removeGame(idParam);
      router.replace("/games");
    } else {
      deleteGameMessage =
        "Could not delete game. Refresh the page and try again";
      setTimeout(() => {
        deleteGameMessage = null;
      }, 1000);
    }
  }

  useEffect(() => {
    updateGameState(
      gameExists
        ? gameExists
        : {
            id: uuidv4(),
            title: "",
            options: defaultSettings,
          }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function saveGame() {
    addGame(game.id, game);
    router.replace("/games/" + game.id);
  }

  return (
    <main className="py-8 px-4 mx-auto max-w-md flex flex-col flex-1">
      <div className="flex justify-between">
        <h1 className="font-lucky text-4xl">
          {gameExists ? "Edit Game" : "New Game"}
        </h1>

        {idParam && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"destructive"}>Delete</Button>
            </DialogTrigger>

            <DialogContent className="text-black bg-white sm:mx-4 ">
              {deleteGameMessage ? (
                <p>{deleteGameMessage}</p>
              ) : (
                <>
                  <p className="">Are you sure you want to delete this game?</p>
                  <div className="flex justify-between gap-4">
                    <DialogClose asChild>
                      <Button variant={"destructive"}>No</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button variant={"ghost"} onClick={handleRemoveGame}>
                        Yes, i want to delete this game
                      </Button>
                    </DialogClose>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="max-w-md my-8">
        <h2 className="font-lucky text-2xl">Game Title</h2>

        <Input
          type="text"
          placeholder="Game Title"
          value={game.title}
          onChange={(e) => updateTitle(e.target.value)}
          className="bg-white text-black"
        />
      </div>
      <section className="my-8 flex flex-col justify-center">
        <h2 className="font-lucky text-2xl">Game rules</h2>

        <div className="mt-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>Add a Rule</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={"start"}>
              {Object.entries(game.options).map(
                // not yet selected elements, visible to user when selecting
                ([ruleKey, { active }], index) =>
                  !active && (
                    <DropdownMenuCheckboxItem
                      key={index}
                      checked={active ? true : false}
                      onCheckedChange={(e) => !e}
                      onSelect={(e) => {
                        //@ts-ignore
                        let checkedState = e.target?.dataset.state;
                        checkedState === "unchecked"
                          ? updateRule(ruleKey, true)
                          : updateRule(ruleKey, false);
                      }}
                    >
                      {createRuleString(ruleKey)}
                    </DropdownMenuCheckboxItem>
                  )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col gap-2 my-2">
          {Object.entries(game.options).map(
            ([rule, { active, conditions }], index) =>
              active && (
                <GameRule
                  key={index}
                  rule={rule}
                  conditions={conditions}
                  editable={true}
                ></GameRule>
              )
          )}
        </div>
      </section>

      <div className="my-2 mt-auto flex justify-center">
        <Button onClick={saveGame} size={"lg"} className="">
          Save Game Settings
        </Button>
      </div>
    </main>
  );
}

export default dynamic(() => Promise.resolve(CreateGame), { ssr: false });
