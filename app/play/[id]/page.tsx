"use client";

import React, { useState } from "react";

export default function PlayGame() {
  const [turns, setTurns] = useState(0);
  const [currentRound, setCurrentRond] = useState(0);

  const completeRound = () => {
    setTurns((turns) => turns + 1);
  };

  return (
    <main>
      <h2>SKÅRBÅRD</h2>
      <div>play this game</div>
      <p>round: {currentRound}</p>

      <button onClick={completeRound}>Next Round</button>
    </main>
  );
}
