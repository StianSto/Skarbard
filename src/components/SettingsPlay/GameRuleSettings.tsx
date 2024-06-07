import { defaultSettings } from "@/lib/functions/gamelogic/defaultSettings";
import createConditions from "@/lib/functions/utils/createConditions";
import createRuleString from "@/lib/functions/utils/createRuleString";
import { useGameSettingsStore } from "@/store/gameSettingsStore";
import { CONDITIONS_GameIsFinished, CONDITIONS_ScoreBy } from "@/types/globals";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";

export default function GameRuleSettings({
  rule,
  conditions,
}: {
  rule: string;
  conditions: CONDITIONS_GameIsFinished | CONDITIONS_ScoreBy;
}) {
  const editable = true;

  const { updateCondition } = useGameSettingsStore((state) => state);

  return (
    <div className="mb-1">
      <h3 className="text-lg ">{createRuleString(rule)}</h3>

      {Object.entries(conditions).map(
        (condition, index) =>
          (condition[1] || condition[1] === 0 || condition[1] === "") && (
            <div className="flex items-center my-2" key={index}>
              <Button
                variant={"destructive"}
                size={"icon"}
                className={"h-0 p-2 w-fit"}
                onClick={() => updateCondition(rule, condition[0], undefined)}
              >
                -
              </Button>
              <p className="text-base ms-2" key={index}>
                {createConditions(rule, condition, editable)}
              </p>
            </div>
          )
      )}

      <div className="mt-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className="py-0">
              + Add a condition
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={"start"}>
            {conditions &&
              Object.entries(conditions).map(
                // not yet selected elements, visible to user when selecting
                (condition, index) =>
                  !condition[1] &&
                  condition[1] !== 0 && (
                    <DropdownMenuCheckboxItem
                      key={index}
                      checked={condition[1] ? true : false}
                      onCheckedChange={(e) => !e}
                      onSelect={(e) => {
                        // @ts-ignore
                        let checkedState = e.target?.dataset.state;
                        checkedState === "unchecked"
                          ? updateCondition(rule, condition[0], "n")
                          : updateCondition(rule, condition[0], undefined);
                      }}
                    >
                      {createConditions(rule, condition, editable)}
                    </DropdownMenuCheckboxItem>
                  )
              )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
