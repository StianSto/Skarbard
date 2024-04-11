"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
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
        <Link href={"/tables/create"}>
          <Button className="px-8  font-extrabold w-full">
            Start New Table
          </Button>
        </Link>
        <Link href={"/games/create"}>
          <Button className="px-8 w-full" variant={"outline"}>
            Create a Game
          </Button>
        </Link>
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
