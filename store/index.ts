import { create } from 'zustand'
import { StorageValue, persist } from 'zustand/middleware'
import { produce } from 'immer'
import { GameOptions, defaultSettings } from '../app/functions/gamelogic/defaultSettings'
import { Game, PlayGame, Player } from '../app/functions/gamelogic/types'

// Initialise a localstorage to avoid error on server side
let localStorage: Storage;
if (typeof window !== 'undefined') localStorage = window.localStorage


const STORE_KEY_PLAYERS = "players"
const STORE_KEY_GAMELIB = "gameLibrary"
const STORE_KEY_TABLES = "tables"

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


interface StorePlayersState {
	players: Player[]
}
interface StorePlayersActions {
	addPlayer: (newPlayer: Player) => void
	removePlayer: (playerID: string) => void
	editPlayer: (playerID: string, newName: string) => void
	updatePlayerList: (playerList: Player[]) => void
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

	updatePlayerList: (newPlayerList) => {
		set(() => ({ players: newPlayerList }))
	},


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

export const storeGameLib = create<StoreGameLibState & StoreGameLibActions>()(persist(
	(set) => {

		return {

			gameLib: new Map([]),

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
		}
	},
	{
		name: STORE_KEY_GAMELIB,
		storage: {
			getItem: (name) => {
				const str = localStorage.getItem(name);
				if (!str) return null;

				const { state } = JSON.parse(str)
				return {
					state: {
						...state,
						gameLib: new Map(state.gameLib)
					}
				}
			},
			setItem: (name, newValue: StorageValue<StoreGameLibState>) => {
				// functions cannot be JSON encoded
				const str = JSON.stringify({
					state: {
						...newValue.state,
						gameLib: Array.from(newValue.state.gameLib.entries()),
					},
				})
				localStorage.setItem(name, str)
			},
			removeItem: (name) => localStorage.removeItem(name),
		}
	}

))

// store Table(s)

interface StoreTablesState {
	tablesState: Map<string, PlayGame>
}

interface StoreTableActions {
	addTable: (newTable: PlayGame) => void
	saveTables: (tables: Map<string, PlayGame>) => void
}

export const useStoreTable = create<StoreTablesState & StoreTableActions>()(persist(

	(set) => {

		return {
			tablesState: new Map([]),

			addTable: (newTable: PlayGame) => {
				set((state) => {
					let updateTable = new Map(state.tablesState)
						.set(newTable.id, newTable)

					state.saveTables(updateTable);
					return { tablesState: updateTable }
				})
			},
			saveTables: (tables) => {
				localStorage.setItem(STORE_KEY_TABLES, JSON.stringify(tables))
			}
		}

	},
	{
		name: STORE_KEY_TABLES,
		storage: {
			getItem: (name) => {
				const str = localStorage.getItem(name);
				if (!str) return null;

				const { state } = JSON.parse(str)
				return {
					state: {
						...state,
						tablesState: new Map(state.tablesState)
					}
				}
			},

			setItem: (name, newValue: StorageValue<StoreTablesState>) => {
				// functions cannot be JSON encoded
				const str = JSON.stringify({
					state: {
						...newValue.state,
						tablesState: Array.from(newValue.state.tablesState.entries()),
					},
				})
				localStorage.setItem(name, str)
			},

			removeItem: (name) => localStorage.removeItem(name),
		}
	}

))