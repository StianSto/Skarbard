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
	afterXTurns?: number,
	afterXTime?: number,
	whenAPlayerGetsXPoints?: number,
}

export type CONDITIONS_ScoreBy = {
	mostPoints?: boolean,
	fewestPoints?: boolean,
}

export const defaultSettings: GameOptions = {
	gameIsFinished: {
		active: true,
		conditions: {
			afterXTime: 20,
			afterXTurns: undefined,
			whenAPlayerGetsXPoints: undefined
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
