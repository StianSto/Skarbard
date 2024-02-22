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

export const defaultSettings: GameOptions = {
	gameIsFinished: {
		active: false,
		conditions: {
			afterXTime: null,
			afterXTurns: null,
			whenAPlayerGetsXPoints: null
		}
	},

	scoreBy: {
		active: false,
		conditions: {
			fewestPoints: false,
			mostPoints: false
		}
	}
}
