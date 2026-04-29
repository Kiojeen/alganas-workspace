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
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }).max(128),
});

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await authClient.signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully!");
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
        id="signup-form"
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your details below to create your account
          </p>
        </div>
        
        <div className="grid gap-4">
          <FieldGroup>
            {/* Name Field */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-form-name">
                    Full Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signup-form-name"
                    type="text"
                    data-invalid={fieldState.invalid}
                    placeholder="John Doe"
                    disabled={isPending}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Email Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-form-email">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="signup-form-email"
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
                <Field data-invalid={fieldState.invalid} className="gap-2">
                  <FieldLabel htmlFor="signup-form-password">
                    Password
                  </FieldLabel>

                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="signup-form-password"
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
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Submit Button */}
            <Button 
              form="signup-form" 
              type="submit" 
              disabled={isPending} 
              className="mt-2 w-full"
            >
              {isPending ? "Creating account..." : "Sign up"}
            </Button>
          </FieldGroup>
        </div>

        {/* Footer / Login Link */}
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            prefetch
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
}

SignUpForm.displayName = "SignUpForm";