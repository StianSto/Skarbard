"use client";

import { Game, PlayGame, Player } from "@/app/functions/gamelogic/types";
import { storeGameLib, storePlayers, useGameSettingsStore } from "@/store";
import SearchGames from "@/components/searchGames";
import { Button } from "@/components/ui/button";
import GameRule from "@/components/ui/gameRule";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";

interface ITable {
  game: Game;
  players: Player[];
  id: string;
  turns: number | null;
  isGameFinished: boolean;
}

export default function Table({ params }: any) {
  // "game" or "players"
  const [multistep, setMultistep] = useState("players");
  const [newPlayer, setNewPlayer] = useState("");

  let localTable: ITable | null = null;
  const { players, addPlayer, editPlayer, removePlayer } = storePlayers(
    (state) => state
  );
  const gameLib = storeGameLib((state) => state.gameLib);

  const { game, resetToDefault, updateGameState } = useGameSettingsStore(
    (state) => state
  );
  const [gameLoaded, setGameLoaded] = useState(false);

  if (typeof window !== "undefined") {
    localTable = JSON.parse(localStorage.getItem("table") || "[]");
  }

  useEffect(() => {
    const gameID = localTable?.game?.id || null;

    const gameCheck = gameID ? gameLib.get(gameID) : null;
    if (gameCheck) {
      updateGameState(game);
      setGameLoaded(true);
    } else {
      resetToDefault();
    }
    // game ? updateGameState(game) : resetToDefault();
  }, []);

  function handleSelectGame(id: string) {
    const updateGame = gameLib.get(id);
    if (!updateGame) return;
    updateGameState(updateGame);
    setGameLoaded(true);
  }

  function handleRemove(id: string) {
    resetToDefault();
    setGameLoaded(false);
  }

  function handleAddPlayer(e: FormEvent) {
    e.preventDefault();

    addPlayer({
      id: uuidv4(),
      name: newPlayer,
    });
    setNewPlayer("");
  }

  useEffect(() => {
    console.log(game);
  }, [game]);
  // function createTable() {
  //   setCreatingTable(true);

  //   // create array of player instances with scrores
  //   const playersScore = players.map((player) => {
  //     return {
  //       id: player.id,
  //       name: player.name,
  //       total: 0,
  //       points: [],
  //     };
  //   });

  //   //

  //   if (!game) return;
  //   const table: PlayGame = {
  //     id: self.crypto.randomUUID(),
  //     players: playersScore,
  //     game,
  //     rounds: 0,
  //   };

  //   localStorage.setItem(table.id, JSON.stringify(table));
  //   router.push("/play/" + table.id);
  // }

  return (
    <main className="py-8 mx-auto max-w-md flex flex-col flex-1 h-screen">
      <h1 className="font-lucky text-center text-4xl">Set Table</h1>
      <nav className="mt-2">
        <div className="flex font-lucky">
          <Button
            className={`text-center font-bold text-2xl flex-1 rounded-e-none  ${
              multistep !== "game" ? "opacity-50" : null
            }`}
            onClick={() => setMultistep("game")}
            variant={"ghost"}
          >
            <span className="relative">
              Game
              {gameLoaded && (
                <span className="absolute -top-2 -right-2 rotate-45 text-lg text-green-500">
                  OK
                </span>
              )}
            </span>
          </Button>
          <Button
            className={`text-center font-bold text-2xl flex-1 p-0 hover:opacity-100 rounded-s-none ${
              multistep !== "players" ? "opacity-50" : null
            }`}
            onClick={() => setMultistep("players")}
            variant={"ghost"}
          >
            <span className="relative">
              Players
              {players && (
                <span className="absolute -top-2 -right-2 rotate-45 text-lg text-green-500 drop-shadow shadow-black">
                  OK
                </span>
              )}
            </span>
          </Button>
        </div>
      </nav>

      {!gameLoaded && multistep === "game" && (
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
            <SearchGames selectGame={(value: any) => handleSelectGame(value)} />
          </div>
        </section>
      )}

      {gameLoaded && multistep === "game" && (
        <section className="my-10">
          <div className="flex justify-between items-center">
            <div className="flex justify-between gap-2">
              <h2 className="font-lucky text-xl">{game.title}</h2>
              <Link href={`/game/${game.id}`}>Edit</Link>
            </div>
            <Button
              onClick={() => handleRemove(game.id)}
              variant={"destructive"}
            >
              Remove
            </Button>
          </div>

          <div className="flex flex-col gap-2 my-2">
            {Object.entries(game.options).map(
              ([rule, { active }], index) =>
                active && <GameRule key={index} ruleKey={rule} />
            )}
          </div>
        </section>
      )}

      {players && multistep === "players" && (
        <section className="my-10">
          <div>
            <form
              className="flex gap-4 mt-4"
              onSubmit={(e) => handleAddPlayer(e)}
            >
              <Input
                value={newPlayer}
                onChange={(e) => setNewPlayer(e.target.value)}
              />
              <Button>Add Player</Button>
            </form>
          </div>

          <div className="flex flex-wrap gap-2 my-10">
            {players.map((player, index) => (
              <p
                key={index}
                className="px-6 py-2 rounded bg-slate-100 text-primary font-bold"
              >
                {player.name}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* <Button onClick={createTable}>
        {creatingTable ? "Creating Table" : "Start Game"}
      </Button> */}
    </main>
  );
}
