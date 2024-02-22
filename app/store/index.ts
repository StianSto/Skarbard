import { create } from 'zustand'
import { produce } from 'immer'
import { GameOptions, defaultSettings } from '../functions/gamelogic/defaultSettings'


interface GameOptionsState {
	gameOptions: GameOptions,
}

interface Actions {
	updateRule: (string: string, newValue: boolean) => void,
	updateCondition: (ruleKey: string, condition: string, newValue: any) => void
	resetToDefault: () => void
}

export const useGameSettingsStore = create<GameOptionsState & Actions>((set) => ({
	gameOptions: defaultSettings,
	updateCondition: (ruleKey, condition, newValue) => {
		set((state) =>
			produce(state, draft => {
				// @ts-ignore
				draft.gameOptions[ruleKey as keyof GameOptions].conditions[condition] = newValue
			})
		)
	},
	updateRule: (ruleKey, newValue) => {
		set((state) =>
			produce(state, draft => {
				// @ts-ignore
				draft.gameOptions[ruleKey as keyof GameOptions].active = newValue
			})
		)
	},
	resetToDefault: () => {
		set({ gameOptions: defaultSettings })
	}
}))