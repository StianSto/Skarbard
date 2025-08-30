"use client";

// react / next
import React, { useEffect, use } from "react";

// store
import { storeGameLib } from "@/store/gameLibraryStore";
import { useGameSettingsStore } from "@/store/gameSettingsStore";

// components
import { Button } from "@/components/ui/button";
import GameRule from "@/components/ui/gameRule";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GameByID(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const id = params.id;
  const router = useRouter();

  const { gameLib } = storeGameLib((state) => state);
  const { game, updateGameState } = useGameSettingsStore((state) => state);

  useEffect(() => {
    const findGame = gameLib.get(id);
    !findGame ? router.replace("/games/create") : updateGameState(findGame);
  }, []);

  return (
    <main className="py-8 px-4 mx-auto max-w-md flex flex-col flex-1">
      <div className="flex flex-wrap justify-between">
        <h1 className="font-lucky text-4xl mt-1">{game.title}</h1>
        <Link href={"/games/create?id=" + id}>
          <Button variant={"outline"}>Edit</Button>
        </Link>
      </div>
      <section className="mt-12 flex flex-col justify-center">
        <h2 className="font-lucky text-2xl">Game rules</h2>

        <div className="flex flex-col gap-2 my-2">
          {Object.entries(game.options).map(
            ([rule, { active, conditions }], index) =>
              active && (
                <GameRule
                  key={index}
                  rule={rule}
                  conditions={conditions}
                  editable={false}
                ></GameRule>
              )
          )}
        </div>
      </section>

      <div className="mt-8 mb-4 flex justify-center">
        <Link href={"/tables/create?game=" + game.id}>
          <Button variant={"outline"}>Create a table!</Button>
        </Link>
      </div>
    </main>
  );
}
