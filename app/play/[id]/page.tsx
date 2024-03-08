"use client";

// react
import React, { useEffect, useState } from "react";

// types
import { ActivePlayer, PlayGame } from "@/app/functions/gamelogic/types";

// components
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

// utils
import { handleGameState } from "@/app/functions/gamelogic";
import { useStoreTable } from "@/store/tablesStore";

export default function Play({ params }: { params: { id: string } }) {
  const { tablesState, addTable } = useStoreTable((state) => state);

  const table = tablesState.get(params.id) as PlayGame;

  const [turns, setTurns] = useState(table?.rounds);
  const [currentTurn, setCurrentTurn] = useState(turns);
  const [gameFinished, setGameFinished] = useState(false);
  const [activePlayers, setActivePlayers] = useState<ActivePlayer[]>([
    ...table.players,
  ]);
  const [highestScore, setHighestScore] = useState(0);

  useEffect(() => {
    updateHighScore();
  }, [table, activePlayers]);

  const updateHighScore = () => {
    const highScore = table.players.reduce((prev, current) => {
      if (current.total > prev.total) return current;
      return prev;
    });
    setHighestScore(() => highScore.total);
  };

  // update table when turn is completed
  const completeTurn = () => {
    let nextTurn = turns + 1;
    setTurns(nextTurn);
    setCurrentTurn(nextTurn);
    updateTable();

    // check if game is completed, according to rules
    if (table) setGameFinished(handleGameState(table));
  };

  const updateTurn = () => {
    updateTable();
  };

  const updateTable = () => {
    const newTable: PlayGame = {
      id: table.id,
      rounds: turns,
      game: table.game,
      players: activePlayers,
      gameFinished,
    };

    addTable(newTable);
    localStorage.setItem(table.id, JSON.stringify(newTable));
  };

  const addpoints = (playerID: string, turn: number, points: number) => {
    const updateScoreboard = activePlayers.map((player) => {
      if (player.id !== playerID) return player;

      player.points[turn] = points;
      player.total = player.points.reduce(
        (sum: number, current: number) => sum + current
      );
      player.total > highestScore
        ? setHighestScore(() => points)
        : updateHighScore();
      return player;
    });

    setActivePlayers(updateScoreboard);
  };

  function Bar({
    score,
    children,
  }: {
    score: number;
    highestScore: number;
    children: React.ReactNode;
  }) {
    let size: number;
    size = highestScore === 0 ? (size = 1) : (size = score / highestScore);
    if (size > 1) size = 1;

    return (
      <p
        className={`px-4 py-2 rounded rounded-s-none bg-cyan-700 flex justify-between scoreboard-bar`}
        style={{ width: size * 100 + "%" }}
      >
        {children}
      </p>
    );
  }

  return (
    <main>
      <h2>SKÅRBÅRD</h2>

      {gameFinished ? (
        <h3>Game Is Finished</h3>
      ) : (
        <>
          <div>playing {table.game?.title}</div>

          {/* scoreboard screen */}
          <section className="my-4 w-4/5">
            <ul className="flex flex-col gap-4">
              {table.players.map((player) => (
                <Bar
                  key={player.id}
                  score={player.total}
                  highestScore={highestScore}
                >
                  <span>{player.name}</span>
                  <span>{player.total}</span>
                </Bar>
              ))}
            </ul>
          </section>

          {/* <div className="flex flex-wrap gap-2">
          </div> */}

          {/* register points drawer */}
          <Drawer>
            <DrawerTrigger>Register Points</DrawerTrigger>
            <DrawerContent className="pb-4 flex justify-center items-center rounded-none border-none bg-white text-black">
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
                      className="flex-0 inline text-center w-16 bg-slate-100"
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
                  onClick={currentTurn === turns ? completeTurn : updateTurn}
                >
                  {currentTurn === turns ? "Complete Turn " : "Update Turn "}
                  {currentTurn + 1}
                </Button>
              </div>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </main>
  );
}
