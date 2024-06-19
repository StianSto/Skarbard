"use client";

import Link from "next/link";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Home, Undo } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Nav() {
  const router = useRouter();
  const [renderNav, setRenderNav] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname);
    if (pathname === "/") return setRenderNav(false);
    if (pathname.startsWith("/play/")) return setRenderNav(false);
    setRenderNav(true);
  }, [pathname]);

  return (
    renderNav && (
      <nav className="flex gap-2 mt-2 ms-2">
        <Link href={"/"} title="front page" aria-description="Front page">
          <Button className="p-2">
            <Home />
          </Button>
        </Link>
        <Button
          className="p-2"
          onClick={() => router.back()}
          title="previous page"
          aria-description="Previous page"
        >
          <Undo />
        </Button>
      </nav>
    )
  );
}
