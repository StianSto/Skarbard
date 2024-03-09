"use client";

// react
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// types
import { ActivePlayer, PlayGame } from "@/app/functions/gamelogic/types";

// components
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

// utils
import { handleGameState } from "@/app/functions/gamelogic";
import { useStoreTable } from "@/store/tablesStore";
import { Input } from "@/components/ui/input";
import playerColors from "@/lib/playerColors";

export default function Play({ params }: { params: { id: string } }) {
  // find table from storage, if not redirect
  const router = useRouter();
  const { tablesState, addTable } = useStoreTable((state) => state);
  const findTable = tablesState.get(params.id);
  if (!findTable) router.replace("/404");
  const table = findTable as PlayGame;

  //enable or disable auto layout of panels.
  const [autoLayout, setAutoLayout] = useState(true);
  const [panelDirection, setPanelDirection] = useState<
    "vertical" | "horizontal"
  >("vertical");

  // table states
  const [turns, setTurns] = useState(table.rounds);
  const [currentTurn, setCurrentTurn] = useState(table.rounds);
  const [gameFinished, setGameFinished] = useState(false);
  const [activePlayers, setActivePlayers] = useState<ActivePlayer[]>(
    table.players
  );
  const [highestScore, setHighestScore] = useState(0);

  useEffect(() => {
    updateHighScore();

    setPanelDirection(windowResizeHandler);
    window.addEventListener("resize", () => {
      setPanelDirection(windowResizeHandler);
    });
  }, []);

  function windowResizeHandler() {
    if (!autoLayout) return panelDirection;
    return window.innerWidth > 768 ? "horizontal" : "vertical";
  }

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

  const updateTable = () => {
    const newTable: PlayGame = {
      id: table.id,
      rounds: turns,
      game: table.game,
      players: activePlayers,
      gameFinished,
    };

    addTable(newTable);
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
        className={`px-4 py-2 rounded rounded-s-none bg-slate-100 text-black font-bold outline-bold flex justify-between scoreboard-bar min-w-[40%]`}
        style={{ width: size * 100 + "%" }}
      >
        {children}
      </p>
    );
  }

  return (
    <main className="h-full font-lucky">
      {gameFinished ? (
        <>
          <h2 className="text-center text-6xl font-lucky">SKÅRBÅRD</h2>
          <h3 className="mx-4">Game Is Finished</h3>
        </>
      ) : (
        table && (
          <>
            <ResizablePanelGroup direction={panelDirection}>
              <ResizablePanel
                defaultSize={50}
                style={{ overflow: "auto" }}
                minSize={panelDirection === "horizontal" ? 30 : 10}
                className="flex flex-col"
              >
                <h2 className="text-center text-6xl font-lucky mt-8">
                  SKÅRBÅRD
                </h2>
                <h3 className="mx-4 text-center text-xl">
                  {table?.game?.title}
                </h3>
                <section className="my-3 md:mt-12 w-4/5 flex-1">
                  <ul className="flex flex-col gap-4">
                    {table?.players.map((player, index) => (
                      <li key={player.id}>
                        <Bar score={player.total} highestScore={highestScore}>
                          <span
                            className="text-stroke"
                            style={{
                              color: `${
                                playerColors[index % playerColors.length]
                              }`,
                            }}
                            property="--var(--text-stroke-color): blue"
                          >
                            {player.name}
                          </span>
                          <span>{player.total}</span>
                        </Bar>
                      </li>
                    ))}
                  </ul>
                </section>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize={50}
                minSize={panelDirection === "horizontal" ? 30 : 10}
                className={`bg-white`}
                style={{ overflow: "auto" }}
              >
                <section className="h-full py-2 flex flex-col items-center rounded-none border-none bg-white text-black max-w-md mx-auto ">
                  <div className="mx-auto grid grid-cols-3 w-full place-items-center my-8">
                    {currentTurn > 0 && (
                      <ChevronLeftIcon
                        className="text-gray-800 h-6 w-6"
                        onClick={() => setCurrentTurn(currentTurn - 1)}
                      />
                    )}
                    <p className="col-start-2 text-3xl text-stroke shadow-slate-950 text-nowrap">
                      Round {currentTurn + 1}
                    </p>
                    {currentTurn < turns && (
                      <ChevronRightIcon
                        className="text-gray-800 h-6 w-6"
                        onClick={() => setCurrentTurn(currentTurn + 1)}
                      />
                    )}
                  </div>

                  <div className="flex flex-col items-center w-full gap-2">
                    {currentTurn.toString() &&
                      activePlayers.map((player) => (
                        <div
                          key={player.id}
                          className="flex justify-between w-full items-center gap-2 mx-auto px-4 min-w-fit"
                        >
                          <p className="flex-1 w-100">{player.name}</p>
                          <Input
                            type="number"
                            className="flex-0 inline text-center w-16 bg-slate-100 hide-numbers"
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
                      onClick={
                        currentTurn === turns ? completeTurn : updateTable
                      }
                      className="mb-6"
                    >
                      {currentTurn === turns
                        ? "Complete Turn "
                        : "Update Turn "}
                      {currentTurn + 1}
                    </Button>
                  </div>
                </section>
              </ResizablePanel>
            </ResizablePanelGroup>
          </>
        )
      )}
    </main>
  );
}
