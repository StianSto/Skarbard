"use client";

import { redirect, useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function NewTable() {
  const id = uuidv4();
  const searchParams = useSearchParams();
  const urlQuery = "?" + searchParams?.toString();

  redirect("/table/" + id + urlQuery);
}
