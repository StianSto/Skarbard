import Link from "next/link";

export default function SetTable() {
  const players = ["Stian", "Bjarne Bernt", "Sulamitten", "fourth guy"];

  return (
    <main>
      <h2>Players</h2>
      <div className="flex flex-wrap gap-2">
        {players.map((player, index) => (
          <p key={index} className="px-4 py-2 rounded bg-cyan-700">
            {player}
          </p>
        ))}
      </div>
      <Link href={"/game/overview/123"}>Overview</Link>
    </main>
  );
}
