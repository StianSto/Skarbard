"use client";

// react
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// types
import { PlayGame } from "@/types/globals";

// components
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Link from "next/link";

// utils
import { handleGameState } from "@/lib/functions/gamelogic";
import { useStoreTable } from "@/store/tablesStore";
import PlayLeftPanel from "./PlayLeftPanel";
import PlayRightPanel from "./PlayRightPanel";

export default function Play({ params }: { params: { id: string } }) {
  // find table from storage, if not redirect
  const router = useRouter();
  const { tablesState, addTable } = useStoreTable((state) => state);
  const findTable = tablesState.get(params.id);
  if (!findTable) router.replace("/404");
  const table = findTable as PlayGame;

  const [tableFinished, setTableFinished] = useState(table.tableFinished);
  const [autoLayout, setAutoLayout] = useState(true);
  const [panelDirection, setPanelDirection] = useState<
    "vertical" | "horizontal"
  >("vertical");

  //enable or disable auto layout of panels.
  useEffect(() => {
    windowResizeHandler();
    window.addEventListener("resize", () => {
      windowResizeHandler();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function windowResizeHandler() {
    switch (screen.orientation.type) {
      case "landscape-primary":
      case "landscape-secondary":
        setPanelDirection("horizontal");
        break;
      case "portrait-primary":
      case "portrait-secondary":
        setPanelDirection("vertical");
        break;
    }
  }

  // update page when table is finished

  useEffect(() => {
    setTableFinished(handleGameState(table));
  }, [table]);

  useEffect(() => {
    addTable({ ...table, tableFinished });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableFinished]);

  return (
    <main className="h-full font-lucky">
      {tableFinished ? (
        <section className="flex flex-col items-center h-full gap-10 pt-8">
          <h2 className="text-6xl font-lucky">SKÅRBÅRD</h2>
          <h3 className="mx-4 text-3xl">Game Is Finished</h3>
          <Link href={"/results/" + table.id}>
            <Button variant={"outline"} className="font-sans font-bold ">
              View Results
            </Button>
          </Link>
        </section>
      ) : (
        table && (
          <ResizablePanelGroup direction={panelDirection}>
            <ResizablePanel
              defaultSize={50}
              style={{ overflow: "auto" }}
              minSize={panelDirection === "horizontal" ? 30 : 10}
              className="flex flex-col"
            >
              <PlayLeftPanel table={table} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize={50}
              style={{ overflow: "auto" }}
              minSize={panelDirection === "horizontal" ? 30 : 10}
              className={`bg-white`}
            >
              <PlayRightPanel table={table} addTable={addTable} />
            </ResizablePanel>
          </ResizablePanelGroup>
        )
      )}
    </main>
  );
}
