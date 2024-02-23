"use client";

import { Game, PlayGame, Player } from "@/app/functions/gamelogic/types";
import { useGameSettingsStore } from "@/app/store";
import SearchGames from "@/components/searchGames";
import { Button } from "@/components/ui/button";
import GameRule from "@/components/ui/gameRule";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Table({ params }: any) {
  const [multistep, setMultistep] = useState("game");

  const savedPlayers = localStorage.getItem("players");
  const players: Player[] = savedPlayers ? JSON.parse(savedPlayers) : [];
  const searchParams = useSearchParams();

  const gameID = searchParams?.get("game");
  const [creatingTable, setCreatingTable] = useState(false);
  const router = useRouter();

  const gameLib = new Map<string, Game>(
    JSON.parse(localStorage.getItem("gameLibrary") || "[]")
  );
  const game = gameID ? gameLib.get(gameID) : null;
  const updateGameState = useGameSettingsStore(
    (state) => state.updateGameState
  );
  const resetToDefault = useGameSettingsStore((state) => state.resetToDefault);

  useEffect(() => {
    game ? updateGameState(game) : resetToDefault();
  }, []);

  function createTable() {
    setCreatingTable(true);

    // create array of player instances with scrores
    const playersScore = players.map((player) => {
      return {
        id: player.id,
        name: player.name,
        total: 0,
        points: [],
      };
    });

    //

    if (!game) return;
    const table: PlayGame = {
      id: self.crypto.randomUUID(),
      players: playersScore,
      game,
      rounds: 0,
    };

    localStorage.setItem(table.id, JSON.stringify(table));
    router.push("/play/" + table.id);
  }

  return (
    <main className="py-8 mx-auto max-w-md flex flex-col flex-1 h-screen">
      <h1 className="font-lucky text-center text-4xl">Set Table</h1>
      <nav className="mt-2">
        <ul className="flex font-lucky">
          <li
            className={`text-center font-bold text-2xl flex-1 ${
              multistep !== "game" ? "opacity-50" : null
            }`}
          >
            Game
          </li>
          <li
            className={`text-center font-bold text-2xl flex-1 ${
              multistep !== "players" ? "opacity-50" : null
            }`}
          >
            Players
          </li>
        </ul>
      </nav>

      {
        /* game */
        multistep === "game" && (
          <section className="flex flex-col justify-center my-6">
            <Link href={"/game"} className="flex justify-center">
              <Button
                variant={"secondary"}
                className="bg-yellow-300 text-black my-4 flex-1"
              >
                CREATE A NEW GAME
              </Button>
            </Link>
            <div className="text-center flex items-center gap-4 px-4 my-10 flex-1 opacity-50 w-72 mx-auto">
              <Separator className="w-auto flex-1" />
              <span>or</span>
              <Separator className="w-auto flex-1" />
            </div>
            <div>
              <SearchGames />
            </div>
          </section>
        )
      }

      {/* players */}
      <section></section>

      {/* <section className="mt-4">
        <h2>Game: {game ? game.title : <i>choose a game</i>}</h2>
        {game && (
          <>
            <h2>Game rules</h2>
            {Object.entries(game.options).map(
              ([ruleKey, { active }], index) =>
                active && <GameRule ruleKey={ruleKey} key={index} />
            )}
          </>
        )}
      </section>
      <section className="mt-4">
        <div className="flex justify-between items-center">
          <h2>Players</h2>
          <Link href={"/table"}>Edit</Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {players.map((player, index) => (
            <p key={index} className="px-4 py-2 rounded bg-cyan-700">
              {player.name}
            </p>
          ))}
        </div>
      </section>
					*/}

      {/* <Button onClick={createTable}>
        {creatingTable ? "Creating Table" : "Start Game"}
      </Button> */}
    </main>
  );
}
