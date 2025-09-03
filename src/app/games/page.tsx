"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Game } from "@/types/globals";
import Link from "next/link";
import { storeGameLib } from "@/store/gameLibraryStore";
import { Button } from "@/components/ui/button";

export default function Games() {
  const gameLib = Array.from(storeGameLib((state) => state.gameLib).values());
  const [searchInput, setSearchInput] = useState("");

  return (
    <main className="flex flex-col items-center py-8 px-4 ">
      {/* <Image
        width={500}
        height={100}
        src={"/skarbardLogo.svg"}
        alt="skårbård logo"
        className="w-full max-w-[300px]"
        loading="eager"
      ></Image> */}

      <section className="w-full max-w-[800px] my-8">
        <h1 className="text-3xl font-lucky ">Games</h1>

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

          <DisplayGamesList games={gameLib} searchInput={searchInput} />
        </div>
      </section>
    </main>
  );
}

function DisplayGamesList({
  games,
  searchInput,
}: {
  games: Game[];
  searchInput: string;
}) {
  const [searchGamesArray, setsearchGamesArray] = useState([...games]);
  useEffect(() => {
    setsearchGamesArray(() => {
      return games.filter((game) =>
        game.title.toLowerCase().includes(searchInput)
      );
    });
  }, [searchInput, games]);
  return (
    <ul className="flex flex-wrap gap-3">
      {searchGamesArray.map(({ id, title }) => (
        <li key={id}>
          <Link href={"/games/" + id}>
            <Button
              variant={"default"}
              className="bg-white hover:bg-slate-100 py-2 h-auto"
              size={"default"}
            >
              <span className="font-lucky px-6 text-lg mt-1">{title}</span>
            </Button>
          </Link>
        </li>
      ))}
    </ul>
  );
}
