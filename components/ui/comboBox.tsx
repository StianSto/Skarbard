"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select } from "./select";

const rules = [
  {
    value: "gameIsFinished",
    label: "Game Ends",
  },
  {
    value: "scoreBy",
    label: "Winner Is",
  },
];

export function Combobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between bg-slate-100"
        >
          <span>
            {value
              ? rules.find((rule) => rule.value.toLowerCase() === value)?.label
              : "Select rule..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 text-black" align="start">
        <Command>
          <CommandInput placeholder="Search rule..." />
          <CommandEmpty>No rule found.</CommandEmpty>
          <CommandGroup>
            {rules.map((rule) => (
              <CommandItem
                key={rule.value}
                value={rule.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
                className="text-black"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === rule.value.toLowerCase()
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {rule.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>

        {value && <Select></Select>}
      </PopoverContent>
    </Popover>
  );
}
