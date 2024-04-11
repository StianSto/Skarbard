// react / next
import React from "react";

// types and variable imports
import {
  CONDITIONS_GameIsFinished,
  CONDITIONS_ScoreBy,
  GameOptions,
} from "@/types/globals";

// store
import { useGameSettingsStore } from "@/store/gameSettingsStore";

// components
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// utils
import createConditions from "@/lib/functions/utils/createConditions";
import createRuleString from "@/lib/functions/utils/createRuleString";
import { defaultSettings } from "@/lib/functions/gamelogic/defaultSettings";

export default function GameRule({
  rule,
  conditions,
  editable = false,
}: {
  rule: string;
  conditions: CONDITIONS_GameIsFinished | CONDITIONS_ScoreBy;
  editable?: boolean;
}) {
  const { updateRule, updateCondition } = useGameSettingsStore(
    (state) => state
  );

  const defaultRule = defaultSettings[rule as keyof GameOptions];
  const defaultConditions = defaultRule?.conditions;

  conditions = {
    ...defaultConditions,
    ...conditions,
  };

  return (
    <Card className="w-full max-w-md p-4 relative">
      <CardHeader className="text-lg font-bold p-0">
        {createRuleString(rule)}
      </CardHeader>
      <Separator />

      <CardContent className="text-base p-0 mt-2">
        <ul className="flex flex-col gap-3">
          {conditions &&
            Object.entries(conditions).map(
              // selected elements, visible to user
              (condition, index) =>
                (condition[1] || condition[1] === 0 || condition[1] === "") && (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {editable && (
                        <Button
                          variant={"destructive"}
                          size={"sm"}
                          className={"h-0 py-3"}
                          onClick={() =>
                            updateCondition(rule, condition[0], undefined)
                          }
                        >
                          -
                        </Button>
                      )}

                      <p>{createConditions(rule, condition, editable)}</p>
                    </div>
                  </li>
                )
            )}
        </ul>

        {editable && (
          <div className="mt-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-primary" asChild>
                <Button variant={"default"}>Add a condition</Button>
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
        )}
      </CardContent>

      {editable && (
        <Button
          onClick={() => updateRule(rule, false)}
          variant={"destructive"}
          className="absolute -top-3 -right-3 hover size-10 p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </Button>
      )}
    </Card>
  );
}
