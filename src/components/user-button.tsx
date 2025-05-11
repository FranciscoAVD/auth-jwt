import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { deleteSession } from "@/lib/jwt-strategy";
import { redirect } from "next/navigation";

export async function UserButton({
  name,
  email,
  className,
  align,
}: {
  name: string;
  email: string;
  className?: string;
  align?: "center" | "start" | "end";
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className={`uppercase rounded-full ${className}`}
        >
          <span>{name[0]}</span>
          <span className="sr-only">User menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-fit p-1">
        <header className="px-3 py-2 leading-3">
          <span className="font-medium">{name}</span>
          <p className="text-neutral-500 text-sm">{email}</p>
        </header>
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
