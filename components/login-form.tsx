"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { Loader2 } from "lucide-react";
import { useLogin } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { env } from "@/env.mjs";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const usernameRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    if (!username || !password) {
      return toast.error("Please fill in all fields.");
    }
    login({ username, password });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    ref={usernameRef}
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    ref={passwordRef}
                    id="password"
                    placeholder="Enter password"
                    type="password"
                    required
                  />
                </div>
                <Button
                  disabled={isPending}
                  onClick={handleSubmit}
                  type="submit"
                  className="w-full"
                >
                  {isPending ? <Loader2 className="animate-spin" /> : "Login"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        &copy; {new Date().getFullYear()} {env.NEXT_PUBLIC_APP_NAME} | All rights reserved.
      </div>
    </div>
  );
}
