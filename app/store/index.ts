import { create } from 'zustand'
import { produce } from 'immer'
import { GameOptions, defaultSettings } from '../functions/gamelogic/defaultSettings'
import { Game, Player } from '../functions/gamelogic/types'


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


const STORE_KEY_PLAYERS = "players"
interface Store {
	players: Player[]
}
interface StoreActions {
	addPlayer: (newPlayer: Player) => void
	removePlayer: (playerID: string) => void
	editPlayer: (playerID: string, newName: string) => void
	savePlayers: (players: Player[]) => void
}

export const storePlayers = create<Store & StoreActions>((set) => ({
	players: JSON.parse(localStorage.getItem('players') || "[]"),

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