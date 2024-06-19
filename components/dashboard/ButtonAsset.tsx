/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectCrypto } from "./SelectCrypto";

export function ButtonAsset() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="group rounded-xl relative inline-flex h-9 items-center justify-center overflow-hidden bg-gradient-to-r from-indigo-500 to-indigo-700 px-3 md:px-6 font-medium text-neutral-200 transition hover:scale-110">
          <span>Add Asset</span>
          <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
            <div className="relative h-full w-8 bg-white/20"></div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Add Asset</DialogTitle>
          {/* <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription> */}
        </DialogHeader>
        <div className="grid ">
          <div className="">
            <Label htmlFor="searchCrypto" className="text-right">
              Search for a crypto
            </Label>
            <SelectCrypto />
          </div>
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div> */}
        </div>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
