import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { deleteSession, getCurrentUser } from "@/lib/jwt-strategy";
import { redirect } from "next/navigation";

export async function UserButton({
  className,
  align,
}: {
  className?: string;
  align?: "center" | "start" | "end";
}) {
  const user = await getCurrentUser();
  if (!user) return null;

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
      <PopoverContent align={align} className="w-fit p-1">
        <header className="px-3 py-2 leading-3">
          <span className="font-medium">{user.name}</span>
          <p className="text-neutral-500 text-sm">{user.email}</p>
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
