"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useStoreTable } from "@/store/tablesStore";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";

import { PlayGame } from "@/types/globals";
import Link from "next/link";

export default function Tables() {
  const tables = Array.from(
    useStoreTable((state) => state.tablesState).values()
  ).toSorted((a, b) => Date.parse(b.created) - Date.parse(a.created));
  const [searchInput, setSearchInput] = useState("");

  return (
    <main className="flex flex-col items-center px-4 py-8 ">
      {/* <Image
        width={500}
        height={100}
        src={"/skarbard_logo.png"}
        alt="skårbård logo"
        className="w-full max-w-[300px]"
        loading="eager"
      ></Image> */}

      <section className="w-full max-w-[800px] my-8">
        <h1 className="text-3xl font-lucky ">Tables</h1>
        <div>
          <div className="relative">
            <Input
              placeholder="Search Tables"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              className="flex-1 pb-1 border-0 rounded-none"
            ></Input>
            <Search className="absolute right-0 -translate-y-1/2 top-1/2 me-2" />
          </div>
          <Separator className="mb-2" />
        </div>
        <DisplayTablesList tables={tables} searchInput={searchInput} />
      </section>
    </main>
  );
}

function DisplayTablesList({
  tables,
  searchInput,
}: {
  tables: PlayGame[];
  searchInput: string;
}) {
  const [searchTablesArray, setSearchTablesArray] =
    useState<PlayGame[]>(tables);

  useEffect(() => {
    setSearchTablesArray(() =>
      tables.filter((table) =>
        table.game?.title.toLowerCase().includes(searchInput.toLowerCase())
      )
    );
  }, [searchInput, tables]);

  return (
    <>
      <div>
        <ul className="grid gap-2">
          {searchTablesArray.map((table) => {
            if (table.tableFinished) return;

            const created = new Date(table.created);
            const createdToday =
              new Date().toLocaleDateString() === created.toLocaleDateString();

            return (
              <li
                key={table.id}
                className="flex text-black bg-white rounded font-lucky"
              >
                <Link
                  href={"/tables/" + table.id}
                  className="flex flex-col flex-1 p-4 pt-5 leading-none "
                >
                  <span className="text-sm text-neutral-500">
                    {createdToday
                      ? "today at " +
                        created.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : created.toLocaleDateString()}
                  </span>
                  <span className="text-xl leading-none">
                    {table.game?.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
