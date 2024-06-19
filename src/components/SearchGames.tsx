"use client";
// react
import React, { useEffect, useState } from "react";

// types
import { Game } from "@/types/globals";

// store
import { storeGameLib } from "@/store/gameLibraryStore";

// components
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

export default function SearchGames({ selectGame }: { selectGame: any }) {
  const gameLib = Array.from(storeGameLib((state) => state.gameLib).values());

  const [searchInput, setSearchInput] = useState("");
  const [searchGameArray, setSearchGameArray] = useState<Game[]>([]);

  useEffect(() => {
    setSearchGameArray(() => {
      return gameLib.filter((game) => game.title.includes(searchInput));
    });
  }, [searchInput]);

  const handleClick = (value: string) => {
    selectGame(value);
  };

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
          <li key={id}>
            <Button
              variant={"default"}
              className="bg-white hover:bg-slate-100"
              onClick={() => handleClick(id)}
            >
              {title}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
