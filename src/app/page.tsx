import Link from "next/link";

export default function Home() {
  return (
    <>
      <header className="fixed top-0 inset-x-0 h-16 flex items-center px-4">
        <Link href="/protected">Protected Page</Link>
      </header>
      <main className="h-screen grid place-content-center">
        <h1 className="text-5xl font-semibold">Home page</h1>
      </main>
    </>
  );
}
