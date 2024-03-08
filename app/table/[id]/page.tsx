"use client";

// react/next
import { FormEvent, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// types
import { ActivePlayer, Game, PlayGame } from "@/app/functions/gamelogic/types";

// stores
import { useStoreTable } from "@/store/tablesStore";
import { storeGameLib } from "@/store/gameLibraryStore";
import { storePlayers } from "@/store/playersStore";

// components
import SearchGames from "@/components/searchGames";
import { Button } from "@/components/ui/button";
import GameRule from "@/components/ui/gameRule";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { LucideX } from "lucide-react";

// utils
import { v4 as uuidv4 } from "uuid";

function Table({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id;

  // "game" or "players"
  const [multistep, setMultistep] = useState("game");
  const [newPlayer, setNewPlayer] = useState("");
  const [creatingTable, setCreatingTable] = useState("Start Game");

  const { players, addPlayer, editPlayer, removePlayer, updatePlayerList } =
    storePlayers((state) => state);
  const gameLib = storeGameLib((state) => state.gameLib);
  const [game, setGame] = useState<Game | null>(null);
  const { tablesState, addTable } = useStoreTable((state) => state);

  const [table, setTable] = useState(
    tablesState.get(id) || {
      id,
      game: null,
      gameFinished: false,
      rounds: 0,
      players,
    }
  );

  useEffect(() => {
    let newTable: PlayGame | undefined = tablesState.get(id);
    if (!newTable) return;

    setGame(() => newTable?.game as Game | null);
    updatePlayerList(newTable.players);
  }, []);

  function handleSelectGame(id: string) {
    const updateGame = gameLib.get(id);
    if (!updateGame) return;
    setGame(updateGame);
    setTable((state) => {
      state.game = updateGame;
      return state;
    });
  }

  function handleRemove(id: string) {
    setGame(() => null);
  }

  function handleAddPlayer(e: FormEvent) {
    e.preventDefault();

    addPlayer({
      id: uuidv4(),
      name: newPlayer,
    });
    setNewPlayer("");
  }

  function saveTable() {
    setTable((state) => {
      state.game = game ? game : null;
      return state;
    });

    setTable((state) => {
      const playersScore: ActivePlayer[] = players.map((player) => {
        return {
          id: player.id,
          name: player.name,
          total: 0,
          points: [],
        };
      });

      state.players = playersScore;
      return state;
    });
  }

  function createTable() {
    if (!table) return;
    if (!game) return;
    if (!players) return;

    setCreatingTable("saving Table");
    saveTable();

    addTable(table as PlayGame);
    setCreatingTable("Creating Table");

    router.push("/play/" + table.id);
  }

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
              {game && (
                <span className="absolute -top-2 -right-2 rotate-45 text-lg text-green-500  drop-shadow shadow-black">
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
              {players.length > 0 && (
                <span className="absolute -top-2 -right-2 rotate-45 text-lg text-green-500 drop-shadow shadow-black">
                  OK
                </span>
              )}
            </span>
          </Button>
        </div>
      </nav>

      {/* create or select game */}
      {!game && multistep === "game" && (
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

      {/* show and edit/remove selected game*/}
      {game && multistep === "game" && (
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
              ([key, { active, conditions }]) =>
                active && (
                  <GameRule key={key} rule={key} conditions={conditions} />
                )
            )}
          </div>
        </section>
      )}

      {/* show and add/edit/remove players to table*/}
      {multistep === "players" && (
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

          <ul className="flex flex-wrap gap-2 my-10">
            {players.map((player, index) => (
              <li
                key={index}
                className="px-2 py-2 rounded bg-slate-100 flex text-black"
              >
                <p className="px-3 font-bold">{player.name}</p>
                <LucideX onClick={() => removePlayer(player.id)} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {game && players.length > 0 && (
        <Button onClick={createTable}>{creatingTable}</Button>
      )}
    </main>
  );
}

export default dynamic(() => Promise.resolve(Table), { ssr: false });
