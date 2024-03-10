"use client";

// react / next

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
// types
import { PlayGame, Player } from "@/app/functions/gamelogic/types";

// store
import { storeGameLib } from "@/store/gameLibraryStore";
import { useGameSettingsStore } from "@/store/gameSettingsStore";

// components
import { Button } from "@/components/ui/button";
import GameRule from "@/components/ui/gameRule";
import Link from "next/link";

function Overview({ params }: any) {
  let savedPlayers;
  let players: Player[] = [];
  if (typeof window !== "undefined") {
    savedPlayers = localStorage.getItem("players");
    players = savedPlayers ? JSON.parse(savedPlayers) : [];
  }

  const searchParams = useSearchParams();
  const gameID = searchParams?.get("game");
  const [creatingTable, setCreatingTable] = useState(false);
  const router = useRouter();

  const gameLib = storeGameLib((state) => state.gameLib);
  const { game, updateGameState, resetToDefault } = useGameSettingsStore(
    (state) => state
  );

  useEffect(() => {
    let updateGame = gameID ? gameLib.get(gameID) : null;
    updateGame ? updateGameState(updateGame) : resetToDefault();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      gameFinished: false,
    };

    localStorage.setItem(table.id, JSON.stringify(table));
    router.push("/play/" + table.id);
  }

  return (
    <main className="py-8 mx-auto max-w-md flex flex-col flex-1">
      <h1 className="font-lucky">Overview</h1>
      <section className="mt-4">
        <h2>Game: {game ? game.title : <i>choose a game</i>}</h2>
        {game && (
          <>
            <h2>Game rules</h2>
            {Object.entries(game.options).map(
              ([ruleKey, { active, conditions }], index) =>
                active && (
                  <GameRule
                    rule={ruleKey}
                    conditions={conditions}
                    key={index}
                  />
                )
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

export default dynamic(() => Promise.resolve(Overview), { ssr: false });
