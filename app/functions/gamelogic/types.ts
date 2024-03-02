import { GameOptions } from "./defaultSettings"

export type Player = {
	id: string,
	name: string,
}

export interface ActivePlayer extends Player {
	total: number,
	points: number[]
}

export type Game = {
	id: string,
	title: string,
	options: GameOptions
}


export type PlayGame = {
	id: string,
	rounds: number,
	game: Game
	players: ActivePlayer[],
}