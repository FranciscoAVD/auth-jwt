import Link from "next/link";
import { UserButton } from "@/components/user-button";

export default function ProtectedPage() {
  return (
    <>
      <header className="fixed top-0 inset-x-0 h-16 flex items-center px-4">
        <Link href="/">Home Page</Link>
        <UserButton className="ml-auto" />
      </header>
      <main className="h-screen grid place-content-center">
        <h1 className="text-5xl font-semibold">Protected page.</h1>
      </main>
    </>
  );
}
