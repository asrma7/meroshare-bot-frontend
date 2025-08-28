"use client";

import { useState, useEffect } from "react";
import { useLoginHandler } from "@/hooks/useAuthHandler";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Loading from "@/components/ui/loading";

const FormSchema = z.object({
  identifier: z.string().min(2, {
    message: "Invalid Username or Email",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

export default function Login() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
      return;
    }
    setMounted(true);
  }, [token, router]);

  const { handleLoginSubmit, error, isLoggingIn } = useLoginHandler();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && form.formState.errors[name]) {
        form.clearErrors([name]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (error) {
      form.setError("root", {
        type: "manual",
        message: error,
      });
    }
  }, [error, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const success = await handleLoginSubmit(data);

    if (success) {
      toast.success("Login successful!");
      form.reset();
    } else {
      toast.error("Login failed. Please try again.");
    }
  }

  if (!mounted) {
    return <Loading />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="min-w-[400px] max-w-md p-6 shadow-lg">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your credentials</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Display form-level errors */}
              {form.formState.errors.root && (
                <div className="mb-4 p-3 text-sm bg-red-100 border border-red-200 text-red-800 rounded">
                  {form.formState.errors.root.message}
                </div>
              )}

              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem className="my-4">
                    <FormLabel>Username/Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Username/email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="my-4">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoggingIn}>
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center items-center">
              <p className="mt-4 text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-blue-500 hover:underline"
                >
                  Register here
                </Link>
              </p>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </main>
  );
}
