"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { loginAction } from "@/lib/actions";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [previous, formAction, isLoading] = useActionState(loginAction, {
    success: false,
  });
  useEffect(() => {
    if (previous.success) router.push("/protected");
  }, [previous]);
  return (
    <>
      <header className="fixed top-0 inset-x-0 h-16 flex items-center px-4">
        <Link href="/">Home Page</Link>
      </header>
      <main className="h-screen grid place-content-center gap-6">
        <h1 className="text-5xl font-semibold">Login Page</h1>
        <form
          action={formAction}
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
            {previous.errors?.email && (
              <p className="text-red-500 text-sm">{previous.errors.email}</p>
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
            {previous.errors?.password && (
              <p className="text-red-500 text-sm">{previous.errors.password}</p>
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
            Login
          </Button>
        </form>
      </main>
    </>
  );
}
