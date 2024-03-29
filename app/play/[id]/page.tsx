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
import Link from "next/link";
import EndGame from "@/components/endGame";
import Bar from "@/components/Bar";

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
  const [gameFinished, setGameFinished] = useState(table.gameFinished);
  const [activePlayers, setActivePlayers] = useState<ActivePlayer[]>(
    table.players
  );
  const [highestScore, setHighestScore] = useState(0);
  const [minScore, setMinScore] = useState(0);

  useEffect(() => {
    updateHighScore();

    setPanelDirection(windowResizeHandler);
    window.addEventListener("resize", () => {
      setPanelDirection(windowResizeHandler);
    });
  }, []);

  useEffect(() => {
    updateTable();
  }, [gameFinished]);

  function windowResizeHandler() {
    if (!autoLayout) return panelDirection;
    return window.innerWidth > 768 ? "horizontal" : "vertical";
  }

  const updateHighScore = () => {
    let max = 0;
    let min = 0;

    table.players.forEach((player) => {
      if (player.total > max) max = player.total;
      if (player.total < min) min = player.total;
    });

    setHighestScore(max);
    setMinScore(min);
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

      player.total > highestScore
        ? setHighestScore(player.total)
        : updateHighScore();
      return player;
    });

    setActivePlayers(updateScoreboard);
  };

  return (
    <main className="h-full font-lucky">
      {gameFinished ? (
        <section className="flex flex-col items-center pt-8 gap-10 h-full">
          <h2 className="text-6xl font-lucky">SKÅRBÅRD</h2>
          <h3 className="mx-4 text-3xl">Game Is Finished</h3>
          <Button variant={"outline"} className="font-sans font-bold ">
            <Link href={"/results/" + table.id}>View Results</Link>
          </Button>
        </section>
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
                  <div className="gap-4 gap-x-0 ">
                    {table?.players.map((player, index) => (
                      <Bar
                        index={index}
                        playerName={player.name}
                        playerScore={player.total}
                        key={player.id}
                        highScore={highestScore}
                        minScore={minScore}
                      />
                    ))}
                  </div>
                </section>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize={50}
                minSize={panelDirection === "horizontal" ? 30 : 10}
                className={`bg-white`}
                style={{ overflow: "auto" }}
              >
                <section className="h-full my-2 flex flex-col items-center rounded-none border-none bg-white text-black max-w-md mx-auto ">
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
                            className="flex-0 inline text-center w-16 bg-slate-100 hide-numbers text-base"
                            value={player.points[currentTurn] || ""}
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

                    <div className="my-4 flex gap-4 justify-evenly w-full">
                      {table.game?.options.gameIsFinished.active === false && (
                        <EndGame setGameIsFinished={setGameFinished}></EndGame>
                      )}
                      <Button
                        disabled={activePlayers.some((player) => {
                          if (player.points[currentTurn] === 0) return false;
                          if (!player.points[currentTurn]) return true;
                        })}
                        onClick={
                          currentTurn === turns ? completeTurn : updateTable
                        }
                      >
                        {currentTurn === turns
                          ? "Complete Turn "
                          : "Update Turn "}
                        {currentTurn + 1}
                      </Button>
                    </div>
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
