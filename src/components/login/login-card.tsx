 "use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-server/client"

export function CardDemo() {
  const [pendingGoogle, setPendingGoogle] = useState(false)

  const handleGoogleSignIn = () => {
    setPendingGoogle(true)
    void authClient
      .signIn.social({
        provider: "google",
        callbackURL:
          typeof window !== "undefined" ? window.location.origin : undefined,
      })
      .catch((error) => {
        console.error("[Better Auth] Google sign-in failed", error)
      })
      .finally(() => setPendingGoogle(false))
  }

  return (
    <Card className="w-full max-w-md rounded-xl border border-black/10 bg-white px-6 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-black dark:shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Login to your account
        </CardTitle>
        <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400">
          Enter your email below to login to your account
        </CardDescription>
        <CardAction className="justify-self-start">
          <Button variant="link" className="px-0 text-sm font-medium">
            Sign Up
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <form>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-neutral-700 dark:text-neutral-300"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="border-neutral-300 bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label
                  htmlFor="password"
                  className="text-neutral-700 dark:text-neutral-300"
                >
                  Password
                </Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm text-neutral-600 underline-offset-4 hover:underline dark:text-neutral-300"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                className="border-neutral-300 bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2 px-0">
        <Button
          type="submit"
          className="w-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Login
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full border-neutral-300 text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
          onClick={handleGoogleSignIn}
          disabled={pendingGoogle}
        >
          {pendingGoogle ? "Signing in..." : "Login with Google"}
        </Button>
      </CardFooter>
    </Card>
  )
}
