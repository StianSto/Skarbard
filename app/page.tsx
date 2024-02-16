import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-5xl">Skårbård</h1>
      <Link href={"/game"}>New Game</Link>
    </main>
  );
}
