type GameOptions = {
	gameIsFinished?: {
		afterXTurns?: number,
		whenAPlayerGetsXPoints?: number,
	},
	scoreBy?: {
		mostpoints?: false,
		fewestPoints?: false,
	},
}

type Player = {
	id: string,
	name: string,
	total?: number,
	points?: number[]
}

type Game = {
	id: string,
	title: string,
	options: GameOptions
}

type Table = Player[]


type PlayGame = {
	id: string,
	rounds: number,
	game: Game
	table: Table,
}


// example
// const newGame: PlayGame = {
// 	id: "123",
// 	rounds: 2,
// 	players: [{
// 		id: '123',
// 		points: [
// 			2,
// 			3
// 		],
// 		total: 5
// 	}],
// 	game: {
// 		id: '123',
// 		title: 'nimmt 6',
// 		options: {
// 			gameIsFinished: {
// 				afterXTurns: 10
// 			}
// 		}
// 	}
// }