export type Player = {
	id: string,
	name: string,
}

export interface ActivePlayer extends Player {
	total: number,
	points: number[] | null[]
}

export type Game = {
	id: string,
	title: string,
	options: GameOptions
}


export type PlayGame = {
	id: string,
	rounds: number,
	game: Game | null,
	players: ActivePlayer[],
	tableFinished: boolean,
	created: string,
}

export type GameOptions = {
	gameIsFinished: {
		active: boolean,
		conditions: CONDITIONS_GameIsFinished
	},
	scoreBy?: {
		active: boolean
		conditions: CONDITIONS_ScoreBy
	},
}

export type CONDITIONS_GameIsFinished = {
	afterXTurns?: number | null,
	afterXTime?: number | null,
	whenAPlayerGetsXPoints?: number | null,
}

export type CONDITIONS_ScoreBy = {
	mostPoints?: boolean | null,
	fewestPoints?: boolean | null,
}