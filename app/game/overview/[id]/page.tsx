import Link from "next/link";

export default function Overview({ params }: any) {
  const { id } = params;

  const players = ["Stian", "Bjarne Bernt", "Sulamitten", "fourth guy"];

  return (
    <main>
      slug: {id}
      <section className="mt-4">
        <div className="flex justify-between items-center">
          <h2>Game rules</h2>
          <Link href={"/game"}>Edit</Link>
        </div>

        <div>
          <h3>Game Ends</h3>
          <p>rule 1</p>
          <p>rule 2</p>
        </div>
        <div>
          <h3>winner is</h3>
          <p>condition 1</p>
        </div>
      </section>
      <section className="mt-4">
        <div className="flex justify-between items-center">
          <h2>Players</h2>
          <Link href={"/table"}>Edit</Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {players.map((player, index) => (
            <p key={index} className="px-4 py-2 rounded bg-cyan-700">
              {player}
            </p>
          ))}
        </div>
      </section>
      <Link href={`/play/${id}`}>Start Game</Link>
    </main>
  );
}
