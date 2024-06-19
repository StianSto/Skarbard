import Bar from "@/components/Bar";
import { Button } from "@/components/ui/button";
import { PlayGame } from "@/types/globals";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function PlayLeftPanel({ table }: { table: PlayGame }) {
  const [minScore, setMinScore] = useState(0);
  const [highestScore, setHighestScore] = useState(minScore + 1);

  function updateScoreMinMax() {
    let max = 0;
    let min = 0;

    table.players.map((player) => {
      if (player.total > max) max = player.total;
      else if (player.total < min) min = player.total;
    });

    setHighestScore(max);
    setMinScore(min);
  }

  useEffect(() => {
    updateScoreMinMax();
  }, [table]);

  return (
    <>
      <section className="flex justify-center p-2">
        <Link href={"/"}>
          <Button size={"sm"} className="absolute">
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="mt-8 text-6xl text-center font-lucky">SKÅRBÅRD</h2>
          <h3 className="mx-4 text-xl text-center">{table?.game?.title}</h3>
        </div>
        {/* <SettingsPlay /> */}
      </section>
      <section className="flex-1 w-4/5 my-3 md:mt-12">
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
    </>
  );
}
