"use client";

import { Game, PlayGame, Player } from "@/app/functions/gamelogic/types";
import { useGameSettingsStore } from "@/app/store";
import { Button } from "@/components/ui/button";
import GameRule from "@/components/ui/gameRule";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Overview({ params }: any) {
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
      <h1 className="font-lucky">Overview</h1>
      <section className="mt-4">
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
      {/* <Link href={`/play/${id}`}>Start Game</Link> */}
      <Button onClick={createTable}>
        {creatingTable ? "Creating Table" : "Start Game"}
      </Button>
    </main>
  );
}
