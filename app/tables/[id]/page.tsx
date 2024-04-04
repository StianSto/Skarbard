"use client";

// react/next
import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";

// types
import { ActivePlayer, Game } from "@/app/functions/gamelogic/types";

// stores
import { useStoreTable } from "@/store/tablesStore";

// components
import { Button } from "@/components/ui/button";
import GameRule from "@/components/ui/gameRule";
import Link from "next/link";

function ViewTables({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id;
  const searchParams = useSearchParams();
  let editable = searchParams?.get("edit") === "true" ? true : false;

  // "game" or "players"
  const [creatingTable, setCreatingTable] = useState("Continue Playing");

  const { tablesState, addTable } = useStoreTable((state) => state);
  const findTable = tablesState.get(id);
  if (!findTable) router.replace("/404");

  const [table, setTable] = useState(findTable);
  const [game, setGame] = useState<Game>(table?.game as Game);
  const players = table?.players as ActivePlayer[];

  function continueTable() {
    if (!table) return;
    setCreatingTable("Setting up Table");

    router.push("/play/" + table.id);
  }

  return (
    <main className="py-8 px-4 mx-auto max-w-md flex flex-col flex-1">
      <h1 className="font-lucky text-center text-4xl">{game.title}</h1>
      <section className="my-10">
        <div className="flex justify-between items-center">
          <div className="flex justify-between gap-2">
            <h2 className="font-lucky text-xl">Rules and conditions</h2>
            {editable && <Link href={`/game/${game.id}`}>Edit</Link>}
          </div>
        </div>

        <div className="flex flex-col gap-2 my-2">
          {Object.entries(game.options).map(
            ([key, { active, conditions }]) =>
              active && (
                <GameRule key={key} rule={key} conditions={conditions} />
              )
          )}
        </div>
        <div className="my-10">
          <h2 className="font-lucky text-xl">
            Score{" "}
            <span className="font-sans text-sm">(turn {table?.rounds})</span>
          </h2>

          <ul className="flex flex-wrap gap-2">
            {players.map((player, index) => (
              <li
                key={index}
                className="px-2 py-2 rounded bg-slate-100 flex text-black"
              >
                <p className="px-3 font-bold">
                  {player.name}
                  <span className="font-normal ms-2">{player.total}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {game && players.length > 0 && (
        <Button onClick={continueTable}>{creatingTable}</Button>
      )}
    </main>
  );
}

export default dynamic(() => Promise.resolve(ViewTables), { ssr: false });
