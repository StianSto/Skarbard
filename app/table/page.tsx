"use client";

import { redirect, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { v4 as uuidv4 } from "uuid";

function TableRedirect() {
  const id = uuidv4();

  const searchParams = useSearchParams();
  const urlQuery = "?" + searchParams?.toString();

  redirect("/table/" + id + urlQuery);
  return <></>;
}

export default function NewTable() {
  <Suspense>
    <TableRedirect />
  </Suspense>;
}
