import { create } from 'zustand'
import { StorageValue, persist } from 'zustand/middleware'
import { PlayGame } from '../app/functions/gamelogic/types'
import { STORE_KEY_TABLES } from '.';

let localStorage: Storage;
if (typeof window !== 'undefined') localStorage = window.localStorage


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