import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

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
        {/* <img src="/skarbardLogo.svg" className="w-full"></img> */}
      </h1>
      <div className="flex flex-col items-center gap-4">
        <Link href={"/table"}>
          <Button className="px-8  font-extrabold">Start New Table</Button>
        </Link>
        <Link href={"/game"}>
          <Button className="px-8" variant={"outline"}>
            Create a Game
          </Button>
        </Link>
      </div>
      <div></div>
    </main>
  );
}
