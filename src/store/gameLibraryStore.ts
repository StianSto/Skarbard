import { create } from 'zustand'
import { StorageValue, persist } from 'zustand/middleware'
import { Game } from '@/types/globals'
import { STORE_KEY_GAMELIB } from '.';

// Initialise a localstorage to avoid error on server side
let localStorage: Storage;
if (typeof window !== 'undefined') localStorage = window.localStorage

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