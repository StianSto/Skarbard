"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const router = useRouter();

  function newTable() {
    const tableId = uuidv4();
    router.push("/tables/" + tableId);
  }

  function newGame() {
    const gameId = uuidv4();
    router.push("/games/" + gameId);
  }
  return (
    <main className="h-full flex flex-col items-center justify-between p-8 px-4">
      <h1 className="w-full max-w-md logo" aria-label="Skårbård">
        <Image
          width={500}
          height={100}
          src={"/skarbardLogo.svg"}
          alt="skårbård logo"
          className="w-full"
        ></Image>
      </h1>

      <div className="grid justify-items-center gap-2">
        <Button className="px-8  font-extrabold w-full" onClick={newTable}>
          Start New Table
        </Button>
        <Button className="px-8 w-full" variant={"outline"} onClick={newGame}>
          Create a Game
        </Button>
      </div>
      <div className="flex flex-col items-center gap-4"></div>

      <div className="grid justify-items-center gap-2 grid-flow-col auto-cols-fr">
        <Link href={"/tables"} className="w-full">
          <Button className="px-8 w-full" variant={"outline"}>
            My Tables
          </Button>
        </Link>
        <Link href={"/games"} className="w-full">
          <Button className="px-8 w-full" variant={"outline"}>
            Games
          </Button>
        </Link>
      </div>
    </main>
  );
}
