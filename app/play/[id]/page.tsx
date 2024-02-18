"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { handleGameState } from "@/app/functions/gamelogic";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

export default function PlayGame({ params }: { params: { id: string } }) {
  // get table from localstorage
  const fetchTable = localStorage.getItem(params.id) || "";

  // states
  const [table, setTable] = useState<PlayGame>(JSON.parse(fetchTable));
  const [turns, setTurns] = useState(table.rounds);
  const [currentTurn, setCurrentTurn] = useState(turns);
  const [gameFinished, setGameFinished] = useState(false);
  const [activePlayers, setActivePlayers] = useState<ActivePlayer[]>(
    table.players
  );

  // update table when turn is completed
  const completeTurn = () => {
    let nextTurn = turns + 1;
    setTurns(nextTurn);
    setCurrentTurn(nextTurn);
    updateTable();

    // check if game is completed, according to rules
    if (table) setGameFinished(handleGameState(table));
  };

  const updateTable = () => {
    const newTable = {
      id: table.id,
      rounds: turns,
      game: table.game,
      players: activePlayers,
    };

    setTable(newTable);
    localStorage.setItem(table.id, JSON.stringify(newTable));
  };

  const addpoints = (playerID: string, turn: number, points: number) => {
    const updateScoreboard = activePlayers.map((player) => {
      if (player.id !== playerID) return player;

      player.points[turn] = points;
      player.total = player.points.reduce((sum, current) => sum + current);
      return player;
    });

    setActivePlayers(updateScoreboard);
  };

  return (
    <main>
      <h2>SKÅRBÅRD</h2>

      {gameFinished ? (
        <h3>Game Is Finished</h3>
      ) : (
        <>
          <div>play this game</div>
          <div className="flex flex-wrap gap-2">
            {activePlayers.map((player) => (
              <p key={player.id} className="px-4 py-2 rounded bg-cyan-700">
                {player.name}: {player.total}
              </p>
            ))}
          </div>

          <Drawer>
            <DrawerTrigger>
              <Button>Register Points</Button>
            </DrawerTrigger>
            <DrawerContent className="pb-4 flex justify-center items-center">
              <div className="flex flex-col items-center max-w-md w-full gap-2">
                <DrawerHeader className="mx-auto grid grid-cols-3 w-full place-items-center">
                  {currentTurn > 0 && (
                    <ChevronLeftIcon
                      className="text-gray-800 h-6 w-6"
                      onClick={() => setCurrentTurn(currentTurn - 1)}
                    />
                  )}
                  <p className="col-start-2">Turn: {currentTurn}</p>
                  {currentTurn < turns && (
                    <ChevronRightIcon
                      className="text-gray-800 h-6 w-6"
                      onClick={() => setCurrentTurn(currentTurn + 1)}
                    />
                  )}
                </DrawerHeader>

                {activePlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex justify-between items-center gap-2 w-full mx-auto px-4"
                  >
                    <p className="flex-1 w-100">{player.name}</p>
                    <Input
                      type="number"
                      className="flex-0 inline text-center w-16"
                      value={player.points[currentTurn] ?? ""}
                      onChange={(e) =>
                        addpoints(
                          player.id,
                          currentTurn,
                          parseInt(e.target.value ?? "0")
                        )
                      }
                      required
                    />
                  </div>
                ))}

                <Button
                  disabled={activePlayers.some((player) => {
                    if (player.points[currentTurn] === 0) return false;
                    if (!player.points[currentTurn]) return true;
                  })}
                  onClick={completeTurn}
                >
                  Complete Turn {currentTurn}
                </Button>
              </div>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </main>
  );
}
