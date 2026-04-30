"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { FolderIconPicker } from "@/components/folder-icon-picker";
import { DEFAULT_FOLDER_ICON } from "@/components/folder-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { LinkFolderUpsertInput } from "@/features/links/use-link-library";
import type { LinkFolder } from "@/types";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Folder name is required." })
    .max(120, { message: "Folder name must be 120 characters or less." }),
  icon: z.string().trim().min(1),
});

interface LinkFolderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: LinkFolder | null;
  onSave: (folder: LinkFolderUpsertInput) => Promise<void>;
}

export function LinkFolderFormDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: LinkFolderFormDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      icon: initialData?.icon ?? DEFAULT_FOLDER_ICON,
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      name: initialData?.name ?? "",
      icon: initialData?.icon ?? DEFAULT_FOLDER_ICON,
    });
    form.clearErrors();
    form.setFocus("name");
  }, [form, initialData, open]);

  const isSaving = form.formState.isSubmitting;

  const handleSave = async (values: z.infer<typeof formSchema>) => {
    await onSave({
      id: initialData?.id,
      name: values.name.trim(),
      icon: values.icon,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Folder" : "Create Folder"}
          </DialogTitle>
          <DialogDescription>
            Group your saved links into folders with an icon and a clear name.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="grid gap-5 py-4"
            onSubmit={form.handleSubmit(handleSave)}
          >
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="link-folder-name">
                      Folder name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="link-folder-name"
                      placeholder="e.g. Visual Inspiration"
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
                name="icon"
                control={form.control}
                render={({ field }) => (
                  <FolderIconPicker value={field.value} onChange={field.onChange} />
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
                {isSaving
                  ? "Saving..."
                  : initialData
                    ? "Save Changes"
                    : "Create Folder"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
