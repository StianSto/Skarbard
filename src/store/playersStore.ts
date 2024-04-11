import { create } from 'zustand'
import { Player } from '@/types/globals'
import { STORE_KEY_PLAYERS } from '.'

// Initialise a localstorage to avoid error on server side
let localStorage: Storage;
if (typeof window !== 'undefined') localStorage = window.localStorage

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