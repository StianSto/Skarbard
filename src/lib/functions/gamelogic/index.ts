import { PlayGame } from "../../../types/globals";

// check if game meeets conditions for end.
// if game is finished, calculate winner and results.

export function handleGameState(table: PlayGame) {
	let isGameFinished = table.tableFinished ?? false
	if (!table.game) return isGameFinished
	const gameRules = table.game.options;
	const turns = table.rounds;
	const players = table.players

	if (gameRules.gameIsFinished.active) {
		let conditions = gameRules.gameIsFinished.conditions
		if (conditions.afterXTurns) finishAfterXTurns(conditions.afterXTurns)
		if (conditions.whenAPlayerGetsXPoints) finishWhenAPlayerGetsXPoints(conditions.whenAPlayerGetsXPoints)
	}

	return isGameFinished

	// functions for checking conditions
	function finishAfterXTurns(x: number) {
		if (turns >= x) isGameFinished = true
	}

	function finishWhenAPlayerGetsXPoints(xPoints: number) {
		let pointLimit = xPoints ?? 0
		players.forEach((player: any) => {

			if (player.total >= pointLimit) isGameFinished = true
		});

	}
}

