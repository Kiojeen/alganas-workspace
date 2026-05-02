"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { LinkUpsertInput } from "@/features/links/use-link-library";
import type { ArchiveLink } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LinkFolderChoice {
  id: string;
  name: string;
}

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required." })
    .max(160, { message: "Title must be 160 characters or less." }),
  folderId: z.string().trim().min(1, { message: "Please select a folder." }),
  url: z.url({ message: "Please enter a valid URL." }).trim().max(2048),
  description: z
    .string()
    .trim()
    .max(2000, { message: "Description must be 2000 characters or less." })
    .optional()
    .or(z.literal("")),
});

interface LinkFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId?: string;
  folderChoices?: LinkFolderChoice[];
  initialData?: ArchiveLink | null;
  onSave: (link: LinkUpsertInput) => Promise<void>;
}

export function LinkFormDialog({
  open,
  onOpenChange,
  folderId,
  folderChoices = [],
  initialData,
  onSave,
}: LinkFormDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      folderId: initialData?.folderId ?? folderId ?? "",
      url: initialData?.url ?? "",
      description: initialData?.description ?? "",
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      title: initialData?.title ?? "",
      folderId: initialData?.folderId ?? folderId ?? "",
      url: initialData?.url ?? "",
      description: initialData?.description ?? "",
    });
    form.clearErrors();
    form.setFocus("title");
  }, [form, initialData, open]);

  const isSaving = form.formState.isSubmitting;

  const handleSave = async (values: z.infer<typeof formSchema>) => {
    await onSave({
      id: initialData?.id,
      folderId: values.folderId,
      title: values.title.trim(),
      url: values.url.trim(),
      description: values.description?.trim() ?? undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Link" : "Save New Link"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid gap-4 py-4"
            onSubmit={form.handleSubmit(handleSave)}
          >
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="link-title">Title</FieldLabel>
                    <Input
                      {...field}
                      id="link-title"
                      placeholder="e.g., Great UI Inspiration"
                      className="bg-primary-foreground"
                      data-invalid={fieldState.invalid}
                      disabled={isSaving}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              {!folderId ? (
                <Controller
                  name="folderId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="link-folder">Folder</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSaving}
                      >
                        <SelectTrigger
                          id="link-folder"
                          className="bg-primary-foreground"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Select a folder" />
                        </SelectTrigger>
                        <SelectContent className="bg-primary-foreground">
                          {folderChoices.map((folder) => (
                            <SelectItem key={folder.id} value={folder.id}>
                              {folder.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />
              ) : null}

              <Controller
                name="url"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="link-url">URL</FieldLabel>
                    <Input
                      {...field}
                      id="link-url"
                      type="url"
                      placeholder="https://example.com"
                      className="bg-primary-foreground"
                      data-invalid={fieldState.invalid}
                      disabled={isSaving}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="link-description">
                      Description (Optional)
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="link-description"
                      placeholder="Why are you saving this link?..."
                      className="bg-primary-foreground h-24 resize-none"
                      data-invalid={fieldState.invalid}
                      disabled={isSaving}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
            </FieldGroup>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Link"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
