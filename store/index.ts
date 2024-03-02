import { create } from 'zustand'
import { produce } from 'immer'
import { GameOptions, defaultSettings } from '../app/functions/gamelogic/defaultSettings'
import { Game, Player } from '../app/functions/gamelogic/types'

// Initialise a localstorage to avoid error on server side
let localStorage: Storage;
if (typeof window !== 'undefined') localStorage = window.localStorage


// Store Game Settings

interface GameState {
	game: Game
}

interface Actions {
	updateGameState: (state: Game) => void
	updateTitle: (newValue: string) => void
	updateRule: (string: string, newValue: boolean) => void,
	updateCondition: (ruleKey: string, condition: string, newValue: any) => void
	resetToDefault: () => void
}

export const useGameSettingsStore = create<GameState & Actions>((set) => ({
	game: {
		id: "",
		title: "",
		options: defaultSettings
	},
	updateGameState: (newState) => set(
		{ game: newState }
	),
	updateTitle: (newValue: string) => {
		set(state => produce(state, draft => {
			draft.game.title = newValue
		}))
	},
	updateCondition: (ruleKey, condition, newValue) => {
		set((state) =>
			produce(state, draft => {
				// @ts-ignore
				draft.game.options[ruleKey as keyof GameOptions].conditions[condition] = newValue
			})
		)
	},
	updateRule: (ruleKey, newValue) => {
		set((state) =>
			produce(state, draft => {
				// @ts-ignore
				draft.game.options[ruleKey as keyof GameOptions].active = newValue
			})
		)
	},
	resetToDefault: () => {
		set(state => produce(state, draft => {
			draft.game.options = defaultSettings
		}))
	}
}))

// Store Players


const STORE_KEY_PLAYERS = "players"
const STORE_KEY_GAMELIB = "gameLibrary"
interface StorePlayersState {
	players: Player[]
}
interface StorePlayersActions {
	addPlayer: (newPlayer: Player) => void
	removePlayer: (playerID: string) => void
	editPlayer: (playerID: string, newName: string) => void
	savePlayers: (players: Player[]) => void
}

export const storePlayers = create<StorePlayersState & StorePlayersActions>((set) => ({
	players: JSON.parse(localStorage?.getItem(STORE_KEY_PLAYERS) || "[]"),

	addPlayer: (newPlayer) => {
		set((state) => {
			const updatePlayers = [...state.players, newPlayer]
			state.savePlayers(updatePlayers)
			return { players: updatePlayers };
		})
	},

	removePlayer: (id) => set((state) => {
		const updatePlayers = state.players.filter(player => player.id !== id)
		state.savePlayers(updatePlayers)
		return { players: updatePlayers };
	}),

	editPlayer: (id, name) => set(state => {
		const updatePlayers = state.players.map(player => {
			return player.id !== id ? player : { id, name }
		})
		state.savePlayers(updatePlayers)

		return { players: updatePlayers }
	}),


	savePlayers: (players) => localStorage.setItem(STORE_KEY_PLAYERS, JSON.stringify(players))
}))


// store Game Library

interface StoreGameLibState {
	gameLib: Map<string, Game>
}

interface StoreGameLibActions {
	addGame: (gameID: string, newGame: Game) => void
	removeGame: (gameID: string) => void
	updateGame: (gameID: string, game: Game) => void
	saveGameLib: (gameLib: Map<string, Game>) => void
}

export const storeGameLib = create<StoreGameLibState & StoreGameLibActions>((set) => ({
	gameLib: new Map(JSON.parse(localStorage?.getItem(STORE_KEY_GAMELIB) || '[]')),

	addGame: (id, newGame) => {
		set(state => {

			let updateGameLib = new Map(state.gameLib).set(id, newGame);
			state.saveGameLib(updateGameLib)

			return { gameLib: updateGameLib }
		})
	},

	removeGame: (id) => {
		set(state => {

			let updateGameLib = new Map(state.gameLib);
			updateGameLib.delete(id);
			state.saveGameLib(updateGameLib)

			return { gameLib: updateGameLib }
		})
	},

	updateGame: (id, game) => {
		set(state => {

			let updateGameLib = new Map(state.gameLib);
			updateGameLib.set(id, game);
			state.saveGameLib(updateGameLib)

			return { gameLib: updateGameLib }
		})
	},

	saveGameLib: (GameLib) => {
		localStorage.setItem(STORE_KEY_GAMELIB, JSON.stringify(GameLib))
	}
}))