import React from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Settings, X } from "lucide-react";
import { Button } from "./ui/button";
import EndGame from "./EndGame";
import { PlayGame } from "@/types/globals";

export default function SettingsPlay() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="h-fit">
          <Settings size={"2rem"} />
        </button>
      </SheetTrigger>
      <SheetContent side={"top"}>
        <section className="container">
          <SheetHeader
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <SheetClose asChild style={{ margin: 0 }}>
              <button className="m-0">
                <X size={"2rem"} />
              </button>
            </SheetClose>
          </SheetHeader>
        </section>
      </SheetContent>
    </Sheet>
  );
}
