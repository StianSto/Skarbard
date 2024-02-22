import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
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
      <Link href={"/game"}>New Game</Link>
    </main>
  );
}
