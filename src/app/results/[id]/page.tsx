"use client";

import { ActivePlayer, PlayGame, CONDITIONS_ScoreBy } from "@/types/globals";
import { Button } from "@/components/ui/button";
import { useStoreTable } from "@/store/tablesStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";
import { v4 as uuidv4 } from "uuid";

export default function Results({ params }: { params: { id: string } }) {
  const router = useRouter();

  const { tablesState, addTable } = useStoreTable((state) => state);

  const findTable = tablesState.get(params.id);
  if (!findTable) router.replace("/404");
  const table = findTable as PlayGame;

  const sortedPlayers = calculateWinner(
    table.players,
    table.game?.options.scoreBy?.conditions
  );

  return (
    <main className="flex flex-col items-center py-8 h-full">
      <h1 className="text-6xl font-lucky">SKÅRBÅRD</h1>

      <section className="flex flex-col gap-2 w-full max-w-[500px] items-center mt-8">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`
						${
              index === 0 &&
              "bg-amber-400 border-2 shadow border-yellow-300 py-8 text-xl  "
            }
						${index === 1 && "bg-zinc-300 border-2 shadow border-zinc-100   "}
						${index === 2 && "bg-yellow-600 border-2 shadow border-yellow-400  "}

						flex justify-between bg-white rounded p-4 text-black w-full`}
          >
            <h3>{player.name}</h3>
            <p>{player.total}</p>
          </div>
        ))}
      </section>
      <section className="w-full min-h-fit bottom-0 mt-auto">
        <div className="w-full">
          <div className="flex flex-col gap-2 mx-auto w-40 pt-8 pb-4">
            <Link href={`/tables/create?game=${table.game?.id}`}>
              <Button variant={"outline"} className="w-full">
                Play Again
              </Button>
            </Link>
            <Link href={`/`}>
              <Button variant={"ghost"} className="w-full">
                Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const defaultWinConditions: CONDITIONS_ScoreBy = {
  mostPoints: true,
};

function calculateWinner(
  players: ActivePlayer[],
  winConditions: CONDITIONS_ScoreBy | undefined
) {
  if (!winConditions) winConditions = defaultWinConditions;
  let sortedPlayers = players;

  if (winConditions.mostPoints) {
    sortedPlayers = players.toSorted(
      (playerA, playerB) => playerB.total - playerA.total
    );
  }

  if (winConditions.fewestPoints) {
    sortedPlayers = players.toSorted(
      (playerA, playerB) => playerA.total - playerB.total
    );
  }

  return sortedPlayers;
}
