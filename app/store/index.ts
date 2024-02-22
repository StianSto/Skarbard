import { create } from 'zustand'
import { produce } from 'immer'
import { GameOptions, defaultSettings } from '../functions/gamelogic/defaultSettings'
import { Game } from '../functions/gamelogic/types'


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