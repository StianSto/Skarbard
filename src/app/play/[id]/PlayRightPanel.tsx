import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import EndGame from "@/components/EndGame";
import { ActivePlayer, PlayGame } from "@/types/globals";
import { Input } from "@/components/ui/input";

export default function PlayRightPanel({
  table,
  addTable,
}: {
  table: PlayGame;
  addTable: (newTable: PlayGame) => void;
}) {
  const [currentTurn, setCurrentTurn] = useState(table.rounds);
  const [turns, setTurns] = useState(table.rounds);
  const [activePlayers, setActivePlayers] = useState<ActivePlayer[]>(
    table.players
  );
  const tableFinished = false; // TEMP!!

  const completeTurn = () => {
    let nextTurn = turns + 1;
    setTurns(nextTurn);
    setCurrentTurn(nextTurn);
    updateTable(nextTurn);
  };

  const updateTable = (rounds?: number) => {
    const newTable: PlayGame = {
      id: table.id,
      rounds: rounds || turns,
      game: table.game,
      players: activePlayers,
      tableFinished,
      created: table.created,
    };

    addTable(newTable);
  };

  const addpoints = (playerID: string, turn: number, points: number | null) => {
    if (!points && points !== 0) points = null;

    const updateScoreboard = activePlayers.map((player) => {
      if (player.id !== playerID) return player;

      player.points[turn] = points;
      player.total = player.points.reduce(
        (sum: number, current: number | null) => {
          if (!current) current = 0;
          return sum + current;
        },
        0
      );

      return player;
    });

    setActivePlayers(updateScoreboard);
  };

  return (
    <>
      <section className="flex flex-col items-center h-full max-w-md mx-auto my-2 text-black bg-white border-none rounded-none ">
        <div className="grid w-full grid-cols-3 mx-auto my-8 place-items-center">
          {currentTurn > 0 && (
            <ChevronLeftIcon
              className="w-6 h-6 text-gray-800"
              onClick={() => setCurrentTurn(currentTurn - 1)}
            />
          )}
          <p className="col-start-2 text-3xl text-stroke shadow-slate-950 text-nowrap">
            Round {currentTurn + 1}
          </p>
          {currentTurn < turns && (
            <ChevronRightIcon
              className="w-6 h-6 text-gray-800"
              onClick={() => setCurrentTurn(currentTurn + 1)}
            />
          )}
        </div>

        <div className="flex flex-col items-center w-full gap-2">
          {currentTurn.toString() &&
            activePlayers.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between w-full gap-2 px-4 mx-auto min-w-fit"
              >
                <p className="flex-1 w-100">{player.name}</p>
                <Input
                  type="number"
                  className="inline w-16 text-base text-center flex-0 bg-slate-100 hide-numbers"
                  value={
                    player.points[currentTurn] ||
                    player.points[currentTurn] === 0
                      ? (player.points[currentTurn] as number)
                      : ""
                  }
                  onChange={(e) =>
                    addpoints(
                      player.id,
                      currentTurn,
                      parseFloat(e.target.value)
                    )
                  }
                  required
                />
              </div>
            ))}

          <div className="flex w-full gap-4 my-4 justify-evenly">
            <Button
              disabled={activePlayers.some((player) => {
                if (player.points[currentTurn] === 0) return false;
                if (!player.points[currentTurn]) return true;
              })}
              onClick={
                currentTurn === turns ? completeTurn : () => updateTable()
              }
            >
              {currentTurn === turns ? "Complete Turn " : "Update Turn "}
              {currentTurn + 1}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
