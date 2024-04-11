import { GameOptions } from "@/types/globals";

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
