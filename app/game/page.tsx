"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function NewGame() {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState<GameOptions>({});
  const [gamesStorage, setGamesStorage] = useState<Game[]>([]);

  useEffect(() => {
    let localGames = localStorage.getItem("games");
    setGamesStorage(localGames ? JSON.parse(localGames) : []);
    console.log(gamesStorage);
  }, []);

  useEffect(() => {
    console.log(gamesStorage);
  }, [gamesStorage]);

  function createGame() {
    const newGame: Game = {
      id: self.crypto.randomUUID(),
      title,
      options,
    };

    newGame.options = {
      gameIsFinished: {
        afterXTurns: 10,
        whenAPlayerGetsXPoints: 66,
      },
    };

    gamesStorage.push(newGame);
    localStorage.setItem("games", JSON.stringify(gamesStorage));
  }

  let slug = 123;
  return (
    <main>
      <h2>Game</h2>
      <div>
        <input
          type="text"
          placeholder="Game Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <section>
        <h2>Game rules</h2>
        <div>
          <h3>Game Ends</h3>
          <p>when a player has 66 points</p>
          <p>after 10 turns</p>
        </div>
        <div>
          <h3>winner is</h3>
          <p></p>
        </div>
      </section>
      <button className="p-4" onClick={createGame}>
        Create Game
      </button>
      <Link href={`/game/overview/${slug}`}>
        <button className="p-4">Overview</button>
      </Link>
    </main>
  );
}
