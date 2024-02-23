"use client";

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
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SetTable() {
  const savedPlayers = localStorage.getItem("players");
  const [players, setPlayers] = useState<Player[]>(
    savedPlayers ? JSON.parse(savedPlayers) : []
  );
  const [player, setPlayer] = useState("");

  function handleAddPlayer() {
    const newPlayer: Player = {
      id: self.crypto.randomUUID(),
      name: player,
    };

    const updatePlayers = [...players, newPlayer];
    setPlayers(updatePlayers);
    setPlayer("");
  }

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  return (
    <main className="py-8 mx-auto max-w-md flex flex-col flex-1 h-screen">
      <h2>Players</h2>
      <div className="flex flex-wrap gap-2">
        {players.map((player, index) => (
          <p key={index} className="px-4 py-2 rounded bg-cyan-700">
            {player.name}
          </p>
        ))}
      </div>
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
      <Link href={"/game/overview/123"}>Overview</Link>
    </main>
  );
}
