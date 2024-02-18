

// check if game meeets conditions for end.
// if game s finished, calculate winner and results.




// export default function handleGameState(game) { }

export function handleGameState(table: PlayGame) {


	const gameRules = table.game.options;
	const turns = table.rounds;
	const players = table.players
	let isGameFinished = false

	console.log(turns);

	if (gameRules.gameIsFinished) {
		if (gameRules.gameIsFinished.afterXTurns) finishAfterXTurns()
		if (gameRules.gameIsFinished.whenAPlayerGetsXPoints) finishWhenAPlayerGetsXPoints()
	}



	console.log(isGameFinished);

	return isGameFinished



	function finishAfterXTurns() {
		if (gameRules.gameIsFinished?.afterXTurns) {
			if (turns >= gameRules.gameIsFinished.afterXTurns) {
				isGameFinished = true;
			}
		}
	}

	function finishWhenAPlayerGetsXPoints() {
		if (gameRules.gameIsFinished?.whenAPlayerGetsXPoints) {
			if (!gameRules.gameIsFinished) return

			let pointLimit = gameRules.gameIsFinished.whenAPlayerGetsXPoints ?? 0
			players.map((player) => {

				if (player.total >= pointLimit) {
					isGameFinished = true;
				}
			});
		}
	}
}

