"use client";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Game } from "@/app/functions/gamelogic/types";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Separator } from "./ui/separator";

export default function SearchGames() {
  const fetchGamesFromLocal = JSON.parse(
    localStorage.getItem("gameLibrary") || "[[],[]]"
  );
  const gameLib: Game[] = fetchGamesFromLocal.map(
    (gameMap: [string, Game]) => gameMap[1]
  );
  const [searchInput, setSearchInput] = useState("");
  const [searchGameArray, setSearchGameArray] = useState<Game[]>(gameLib);

  useEffect(() => {
    setSearchGameArray(() =>
      gameLib.filter((game) => game.title.includes(searchInput))
    );
  }, [searchInput]);

  return (
    <div>
      <div className="relative">
        <Input
          placeholder="Search Games"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          className="border-0 rounded-none flex-1 pb-1"
        ></Input>
        <Search className="absolute top-1/2 right-0 -translate-y-1/2 me-2" />
      </div>
      <Separator className="mb-2" />
      <ul className="flex flex-wrap gap-3">
        {searchGameArray.map(({ id, title }) => (
          <li key={id} className="bg-white text-secondary rounded p-2 px-4">
            {title}
          </li>
        ))}
      </ul>
    </div>
  );
}
