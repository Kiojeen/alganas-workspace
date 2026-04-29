"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { authClient } from "@/server/better-auth/client";

const formSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }).max(128),
});

export function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          toast.success("Logged in successfully!");
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    );
  }

  const isPending = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        id="login-form"
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        
        <div className="grid gap-4">
          <FieldGroup>
            {/* Email Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-form-email">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="login-form-email"
                    type="email"
                    data-invalid={fieldState.invalid}
                    placeholder="example@example.com"
                    dir="ltr"
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="grid grid-cols-2 grid-rows-2 items-center justify-between gap-y-2"
                >
                  <FieldLabel
                    htmlFor="login-form-password"
                    className="col-start-1 row-start-1"
                  >
                    Password
                  </FieldLabel>
                  
                  <Link
                    href="/forgot-password"
                    className="text-foreground col-start-2 row-start-1 text-right text-sm underline-offset-4 hover:underline"
                    tabIndex={-1}
                  >
                    Forgot your password?
                  </Link>

                  <InputGroup className="col-span-2 row-start-2">
                    <InputGroupInput
                      {...field}
                      id="login-form-password"
                      type={showPassword ? "text" : "password"}
                      data-invalid={fieldState.invalid}
                      placeholder="••••••••"
                      disabled={isPending}
                    />

                    <InputGroupAddon align="inline-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="hover:bg-transparent"
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="size-4" />
                        ) : (
                          <EyeIcon className="size-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} className="col-span-2" />
                  )}
                </Field>
              )}
            />

            {/* Submit Button */}
            <Button 
              form="login-form" 
              type="submit" 
              disabled={isPending} 
              className="mt-2 w-full"
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </FieldGroup>
        </div>

        {/* Footer / Sign Up Link */}
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            prefetch
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
}

LoginForm.displayName = "LoginForm";