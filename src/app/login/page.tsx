"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { loginAction } from "@/lib/actions";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function LoginPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<any | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const res = await fetch("api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const body = await res.json();
    if (!res.ok) {
      setErrors(body.errors);
      setIsLoading(false);
    } else {
      setErrors(undefined);
      setIsLoading(false);
      router.push("/protected");
    }
  }
  return (
    <>
      <header className="fixed top-0 inset-x-0 h-16 flex items-center px-4">
        <Link href="/">Home Page</Link>
      </header>
      <main className="h-screen grid place-content-center gap-6">
        <h1 className="text-5xl font-semibold">Login Page</h1>
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 border border-white/30 rounded-xl p-4"
        >
          <div className="space-y-1">
            <Label htmlFor="form-login--email">Email</Label>
            <Input
              id="form-login--email"
              name="email"
              type="email"
              placeholder="example@example.com"
            />
            {errors?.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="form-login--password">Password</Label>
            <Input
              id="form-login--password"
              name="password"
              type="password"
              required
            />
            {errors?.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <p className="text-sm text-white/70">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-500">
              Register
            </Link>
          </p>
          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : "Login"}
          </Button>
        </form>
      </main>
    </>
  );
}
