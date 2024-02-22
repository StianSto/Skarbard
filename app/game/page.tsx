"use client";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import GameRule from "@/components/ui/gameRule";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useGameSettingsStore } from "../store";
import { Game } from "../functions/gamelogic/types";

export default function NewGame() {
  const defaultGameOptions = useGameSettingsStore((state) => state.gameOptions);
  const updateRule = useGameSettingsStore((state) => state.updateRule);
  const [title, setTitle] = useState("");
  const [gamesStorage, setGamesStorage] = useState<Game[]>([]);
  const id = self.crypto.randomUUID();

  useEffect(() => {
    let localGames = localStorage.getItem("games");
    setGamesStorage(localGames ? JSON.parse(localGames) : []);
  }, []);

  function saveGame() {
    const newGame: Game = {
      id,
      title,
      options: defaultGameOptions,
    };

    gamesStorage.push(newGame);
    localStorage.setItem("games", JSON.stringify(gamesStorage));
  }

  let slug = 123;
  return (
    <main className="py-8 mx-auto max-w-md flex flex-col flex-1 h-screen">
      <h1 className="font-lucky text-4xl">New Game</h1>
      <div className="max-w-md mb-4">
        <Input
          type="text"
          placeholder="Game Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-white text-black"
        />
      </div>
      <section className="mt-12 flex flex-col justify-center">
        <h2 className="font-lucky text-2xl">Game rules</h2>

        <div className="mt-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>Add a condition</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={"start"}>
              {Object.entries(defaultGameOptions).map(
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
                      {ruleKey}
                    </DropdownMenuCheckboxItem>
                  )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col gap-2 my-2">
          {Object.entries(defaultGameOptions).map(
            ([rule, { active }], index) =>
              active && (
                <GameRule key={index} ruleKey={rule} editable={true}></GameRule>
              )
          )}
        </div>
      </section>

      <div className="my-2 mt-auto flex justify-center">
        <Button onClick={saveGame} size={"lg"} className="text-lg">
          Save Game Settings
        </Button>
      </div>
      {/* <Link href={`/game/overview/${slug}`}>
        <button className="p-4">Overview</button>
      </Link> */}
    </main>
  );
}
