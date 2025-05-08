import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { deleteSession } from "@/lib/jwt-strategy";
import { redirect } from "next/navigation";

export function UserButton({ className }: { className?: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className={`rounded-full ${className}`}
        >
          <User aria-hidden />
          <span className="sr-only">User menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-1">
        <ul className="w-[200px]">
          <li>
            <form
              action={async () => {
                "use server";
                await deleteSession();
                redirect("/");
              }}
            >
              <Button
                variant="ghost"
                type="submit"
                className="justify-start w-full hover:bg-neutral-200"
              >
                <LogOut className="size-4" aria-hidden />
                Log out
              </Button>
            </form>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
