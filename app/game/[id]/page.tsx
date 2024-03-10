"use client";

// react / next
import React, { useEffect, useState } from "react";

// store
import { storeGameLib } from "@/store/gameLibraryStore";
import { useGameSettingsStore } from "@/store/gameSettingsStore";

// types and variable imports
import { Game } from "../../functions/gamelogic/types";
import { defaultSettings } from "@/app/functions/gamelogic/defaultSettings";

// components
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GameRule from "@/components/ui/gameRule";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function GameByID({ params }: { params: { id: string } }) {
  const id = params.id;

  const { gameLib, addGame } = storeGameLib((state) => state);
  const { game, updateRule, updateTitle, updateGameState } =
    useGameSettingsStore((state) => state);

  const initGame: Game = gameLib?.get(id) || {
    id,
    title: "",
    options: defaultSettings,
  };

  useEffect(() => {
    updateGameState(initGame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameLib]);

  function saveGame() {
    addGame(id, game);
  }

  return (
    <main className="py-8 px-4 mx-auto max-w-md flex flex-col flex-1">
      <h1 className="font-lucky text-4xl">New Game</h1>
      <div className="max-w-md mb-4">
        <Input
          type="text"
          placeholder="Game Title"
          value={game.title}
          onChange={(e) => updateTitle(e.target.value)}
          className="bg-white text-black"
        />
      </div>
      <section className="mt-12 flex flex-col justify-center">
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
                      {ruleKey}
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
        <Button
          onClick={saveGame}
          size={"lg"}
          className="text-lg"
          variant={"default"}
        >
          Save Game Settings
        </Button>
      </div>
    </main>
  );
}
