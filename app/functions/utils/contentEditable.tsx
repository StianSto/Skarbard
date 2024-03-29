import { Input } from "@/components/ui/input";
import { useGameSettingsStore } from "@/store/gameSettingsStore";

export default function ContentEditable(
  rule: string,
  [condition, value = "n"]: [string, string],
  editable = false
) {
  if (!value && value != "0") value = "";

  const { updateRule, updateCondition } = useGameSettingsStore(
    (state) => state
  );

  return (
    <>
      <span className="inline-flex mx-1 font-bold">
        {editable ? (
          <Input
            onChange={(e) => (value = e.target.value)}
            onBlur={(e) => {
              updateCondition(rule, condition, e.target.value);
            }}
            type="tel"
            defaultValue={value}
            name={condition}
            className={`inline min-w-0 w-14 py-1 h-fit text-center bg-slate-100 text-md`}
            size={2}
          />
        ) : (
          " " + value + " "
        )}
      </span>
    </>
  );
}
