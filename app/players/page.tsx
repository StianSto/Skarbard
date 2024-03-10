"use client";

// react
import { useState } from "react";

// store
import { storePlayers } from "@/store/playersStore";

// components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LucideX } from "lucide-react";

export default function SetTable() {
  const [player, setPlayer] = useState("");

  const players = storePlayers((state) => state.players);
  const addPlayer = storePlayers((state) => state.addPlayer);
  const removePlayer = storePlayers((state) => state.removePlayer);

  function handleAddPlayer() {
    addPlayer({
      id: self.crypto.randomUUID(),
      name: player,
    });
    setPlayer("");
  }

  return (
    <main className="py-8 mx-auto max-w-md flex flex-col flex-1">
      <h2>Players</h2>
      <ul className="flex flex-wrap gap-2">
        {players.map((player, index) => (
          <li key={index} className="px-2 py-2 rounded bg-cyan-700 flex">
            <p className="px-2">{player.name}</p>
            <LucideX onClick={() => removePlayer(player.id)} />
          </li>
        ))}
      </ul>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Player</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Add player</DialogHeader>
          <DialogDescription>Add players to your table</DialogDescription>
          <div>
            <Input value={player} onChange={(e) => setPlayer(e.target.value)} />
            <div className="flex gap-4 mt-4">
              <Button onClick={handleAddPlayer}>Save</Button>
              <DialogClose>Close</DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* <Link href={"/game/overview/123"}>Overview</Link> */}
    </main>
  );
}
