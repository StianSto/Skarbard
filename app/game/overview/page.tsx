"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Overview({ params }: any) {
  const savedPlayers = localStorage.getItem("players");
  const players: Player[] = savedPlayers ? JSON.parse(savedPlayers) : [];
  const searchParams = useSearchParams();

  const gameID = searchParams?.get("game");
  const [creatingTable, setCreatingTable] = useState(false);
  const router = useRouter();

  const gameLib: Game[] = JSON.parse(localStorage.getItem("games") || "");
  const game = gameLib.find((game) => game.id === gameID);

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
    <main>
      <h1 className="font-lucky">Overview</h1>
      <h2>Game: {game ? game.title : <i>choose a game</i>}</h2>
      <section className="mt-4">
        <div className="flex justify-between items-center">
          <h2>Game rules</h2>
          <Link href={"/game"}>Edit</Link>
        </div>

        <div>
          <h3>Game Ends</h3>
          <p>rule 1</p>
          <p>rule 2</p>
        </div>
        <div>
          <h3>winner is</h3>
          <p>condition 1</p>
        </div>
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
