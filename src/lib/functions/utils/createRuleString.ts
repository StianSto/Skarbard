export default function createRuleString(rule: string) {
	switch (rule) {
		case "gameIsFinished":
			return "Game Ends";

		case "scoreBy":
			return `Winner is`;

		default:
			break;
	}
}