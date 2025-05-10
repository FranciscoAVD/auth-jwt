"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any | undefined>();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const form = new FormData(e.target as HTMLFormElement);
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const response = await fetch("api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      setErrors(data.errors);
      setIsLoading(false);
    } else {
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
        <h1 className="text-5xl font-semibold">Register Page</h1>
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 border border-white/30 rounded-xl p-4"
        >
          <div className="space-y-1">
            <Label htmlFor="form-login--name">Name</Label>
            <Input
              id="form-login--name"
              name="name"
              type="text"
              placeholder="John"
              required
            />
            {errors?.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="form-login--email">Email</Label>
            <Input
              id="form-login--email"
              name="email"
              type="email"
              placeholder="example@example.com"
              required
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
              minLength={8}
              required
            />
            {errors?.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <p className="text-sm text-white/70">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500">
              Login
            </Link>
          </p>
          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : "Register"}
          </Button>
        </form>
      </main>
    </>
  );
}
