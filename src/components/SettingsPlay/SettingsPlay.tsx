"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import EndGame from "../EndGame";
import { Game, PlayGame } from "@/types/globals";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useStoreTable } from "@/store/tablesStore";

import GameRuleSettings from "./GameRuleSettings";
import { Settings, X } from "lucide-react";
import { Button } from "../ui/button";
import { useGameSettingsStore } from "@/store/gameSettingsStore";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import createRuleString from "@/lib/functions/utils/createRuleString";

export default function SettingsPlay({ table }: { table: PlayGame }) {
  const { addTable } = useStoreTable((state) => state);
  const { updateGameState, updateRule, game } = useGameSettingsStore(
    (state) => state
  );
  const [changesMade, setChangesMade] = useState(false);
  const [savingChanges, setSavingChanges] = useState<
    "Save Changes" | "Saving..." | "Saved!"
  >("Save Changes");

  useEffect(() => {
    if (game !== table.game) setChangesMade(true);
  }, [game]);

  useEffect(() => {
    updateGameState(table.game as Game);
    setChangesMade(false);
  }, []);

  function handleSetGameFinished(tableFinished: boolean) {
    addTable({ ...table, tableFinished });
  }

  function handleSaveSettings() {
    setSavingChanges("Saving...");

    const newTable = table;
    newTable.game = game;
    addTable(newTable);

    setSavingChanges("Saved!");
    setTimeout(() => {
      setChangesMade(false);
      setSavingChanges("Save Changes");
    }, 1500);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="h-fit">
          <Settings size={"2rem"} />
        </button>
      </SheetTrigger>
      <SheetContent side={"top"} className="text-black bg-white">
        <section className="container">
          <SheetHeader
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <EndGame setGameIsFinished={handleSetGameFinished} />
            <SheetClose asChild style={{ margin: 0 }}>
              <button className="m-0">
                <X size={"2rem"} />
              </button>
            </SheetClose>
          </SheetHeader>

          <Accordion type="single" collapsible className="mt-3">
            <AccordionItem value="Setting 1">
              <AccordionTrigger>
                <h3 className="text-xl font-lucky">Game settings</h3>
              </AccordionTrigger>
              <AccordionContent>
                <DropdownMenu>
                  {Object.entries(game.options).some(
                    ([key, option]) => option.active === false
                  ) && (
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={"ghost"}
                        className="shadow bg-slate-50 font-bold"
                      >
                        Add a Rule
                      </Button>
                    </DropdownMenuTrigger>
                  )}
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
                                : updateRule(ruleKey, null);
                            }}
                          >
                            {createRuleString(ruleKey)}
                          </DropdownMenuCheckboxItem>
                        )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </AccordionContent>

              {table.game &&
                Object.entries(game.options).map(
                  ([key, { active, conditions }]) =>
                    active && (
                      <AccordionContent key={key}>
                        <GameRuleSettings
                          rule={key}
                          conditions={conditions}
                        ></GameRuleSettings>
                      </AccordionContent>
                    )
                )}
            </AccordionItem>

            <AccordionItem value="Setting 2">
              <AccordionTrigger>
                <h3 className="text-xl font-lucky">Players</h3>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2 ">
                  {table.players.map((player) => (
                    <span className="text-lg" key={player.id}>
                      {player.name}
                    </span>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {changesMade && (
            <div className="my-2">
              <Button
                variant={"ghost"}
                className="shadow"
                onClick={handleSaveSettings}
              >
                {savingChanges}
              </Button>
            </div>
          )}
        </section>
      </SheetContent>
    </Sheet>
  );
}
