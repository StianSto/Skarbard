import playerColors from "@/lib/playerColors";
import React from "react";

export default function Bar({
  playerName,
  playerScore,
  index,
  highScore,
  minScore,
}: {
  playerName: string;
  playerScore: number;
  index: number;
  highScore: number;
  minScore: number;
}) {
  let size = ((playerScore - minScore) / (highScore - minScore)) * 100;
  // safeguard
  if (size < 0) size = 0;
  if (size > 100) size = 100;

  return (
    <div className="relative grid grid-cols-2 my-3 max-w-full">
      <p
        className="text-stroke bg-white py-2 pt-3 ps-4 w-full"
        style={{
          color: `${playerColors[index % playerColors.length]}`,
        }}
        property="--var(--text-stroke-color): blue"
      >
        {playerName}
      </p>
      <p
        className={`px-4 py-2 pt-3 rounded rounded-s-none bg-white text-black font-bold outline-bold scoreboard-bar text-right relative -translate-x-1 relative`}
        style={{ width: size + "%" }}
      >
        <span className="absolute top-50 right-2">{playerScore}</span>
      </p>
    </div>
  );
}
