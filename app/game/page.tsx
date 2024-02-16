import Link from "next/link";
import React from "react";

export default function NewGame() {
  let slug = 123;
  return (
    <main>
      <h2>Game</h2>
      <div>
        <input type="text" placeholder="Game Title" />
      </div>
      <section>
        <h2>Game rules</h2>
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
      <Link href={`/game/overview/${slug}`}>
        <button className="p-4">Overview</button>
      </Link>
    </main>
  );
}
