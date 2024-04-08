import { GameOptions } from "./defaultSettings"

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
	gameFinished: boolean,
	created: string,
}