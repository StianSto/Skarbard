"use client";

// react/next
import { use, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";

// stores
import { useStoreTable } from "@/store/tablesStore";

// components
import { Button } from "@/components/ui/button";
import GameRule from "@/components/ui/gameRule";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

function ViewTables({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id;
  const searchParams = useSearchParams();
  const [errMsg, setErrMsg] = useState("");
  let editable = searchParams?.get("edit") === "true" ? true : false;

  const [creatingTable, setCreatingTable] = useState("Continue Playing");

  const { tablesState, removeTable } = useStoreTable((state) => state);
  const table = tablesState.get(id);
  const game = table?.game;
  const players = table?.players;

  useEffect(() => {
    if (!table)
      return setErrMsg("could not find the table you are looking for");
  }, [table]);

  function continueTable() {
    if (!table) return;
    setCreatingTable("Setting up Table");
    router.push("/play/" + table.id);
  }

  function handleRemoveTable() {
    // return
    try {
      if (!table) throw "no table to delete";
      if (!id) throw "no id of table to delete";
      removeTable(id);
    } catch (error) {
      console.error(error);
      return toast.error("could not delete table");
    }
    toast.success("Table was deleted", {
      className: "!bg-green-300",
    });
    router.replace("/tables");
  }

  return (
    <main className="py-8 px-4 mx-auto max-w-xl flex flex-col flex-1">
      {table && game && players ? (
        <>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant={"destructive"}
                className="absolute top-2 right-2"
              >
                Delete Table
              </Button>
            </DialogTrigger>

            <DialogContent className="text-black bg-white sm:mx-4 ">
              <>
                <p className="">
                  Are you sure you want to delete this game? This will
                  <em>permanently</em> delete this table
                </p>
                <div className="flex justify-between gap-4">
                  <DialogClose asChild>
                    <Button variant={"destructive"}>No</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant={"ghost"} onClick={handleRemoveTable}>
                      Yes, i want to delete this game
                    </Button>
                  </DialogClose>
                </div>
              </>
            </DialogContent>
          </Dialog>
          <h1 className="font-lucky text-center text-4xl">{game.title}</h1>
          <section className="my-10">
            <div className="flex justify-between items-center">
              <div className="flex justify-between gap-2">
                <h2 className="font-lucky text-xl">Rules and conditions</h2>
                {editable && <Link href={`/game/${game.id}`}>Edit</Link>}
              </div>
            </div>

            <div className="flex flex-col gap-2 my-2">
              {Object.entries(game.options).map(
                ([key, { active, conditions }]) =>
                  active && (
                    <GameRule key={key} rule={key} conditions={conditions} />
                  )
              )}
            </div>
            <div className="my-10">
              <h2 className="font-lucky text-xl">
                Score{" "}
                <span className="font-sans text-sm">
                  (turn {table?.rounds})
                </span>
              </h2>

              <ul className="flex flex-wrap gap-2">
                {players.map((player, index) => (
                  <li
                    key={index}
                    className="px-2 py-2 rounded bg-slate-100 flex text-black"
                  >
                    <p className="px-3 font-bold">
                      {player.name}
                      <span className="font-normal ms-2">{player.total}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-lucky">
            Hmmm, it seems something went wrong
          </h2>
          <p>error: {errMsg}</p>

          <Link href={"/tables"} className="mt-8 max-w-10">
            <Button>Go back to my tables page</Button>
          </Link>
        </>
      )}

      {game && (
        <Button onClick={continueTable} className="max-w-fit mx-auto px-8">
          {creatingTable}
        </Button>
      )}
    </main>
  );
}

export default dynamic(() => Promise.resolve(ViewTables), { ssr: false });
