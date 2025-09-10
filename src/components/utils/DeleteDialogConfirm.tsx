import { PropsWithChildren, ReactElement } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface DialogDeleteConfirmProps {
  children: ReactElement<PropsWithChildren>;
	onConfirm: () => void;
	confirmQueryString: string;
	confirmString: string;
}

export default function DialogDeleteConfirm({
  children,
	onConfirm,
	confirmQueryString,
	confirmString
}: DialogDeleteConfirmProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="text-black bg-white sm:mx-4 ">
        <>
          <p className="">{confirmQueryString}</p>
          <div className="flex justify-between gap-4">
            <DialogClose asChild>
              <Button variant={"destructive"}>No</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant={"ghost"} onClick={onConfirm}>
                {confirmString}
              </Button>
            </DialogClose>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}
