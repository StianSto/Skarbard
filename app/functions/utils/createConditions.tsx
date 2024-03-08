import ContentEditable from "./contentEditable";

export default function createConditions(
  rule: string,
  conditions: [string, any],
  editable = false
) {
  switch (conditions[0]) {
    case "afterXTurns":
      return <>After{ContentEditable(rule, conditions, editable)} turns </>;

    case "afterXTime":
      return <>After{ContentEditable(rule, conditions, editable)} minutes </>;

    case "whenAPlayerGetsXPoints":
      return (
        <>
          When a player has over{ContentEditable(rule, conditions, editable)}
          points
        </>
      );

    case "mostPoints":
      return `Player with most points`;

    case "fewestPoints":
      return `Player with fewest points`;

    default:
      return "could not find condition";
  }
}
