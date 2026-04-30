"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  type PromptImageUploadInput,
  type PromptUpsertInput,
} from "@/features/prompts/use-prompt-library";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AiPrompt } from "@/types";
import { MODELS_LIST } from "@/components/models-list";

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required." })
    .max(160, { message: "Title must be 160 characters or less." }),
  model: z.string().trim().min(1, { message: "Please select a model." }),
  promptText: z
    .string()
    .trim()
    .min(1, { message: "Prompt text is required." })
    .max(20000, { message: "Prompt text is too long." }),
});

interface PromptFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string;
  folderName: string;
  initialData?: AiPrompt | null;
  onSave: (prompt: PromptUpsertInput) => Promise<void>;
}

async function fileToBase64(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        reject(new Error("Failed to read image"));
        return;
      }

      const [, dataBase64 = ""] = result.split(",", 2);
      resolve(dataBase64);
    };

    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(file);
  });
}

export function PromptFormDialog({
  open,
  onOpenChange,
  folderId,
  folderName,
  initialData,
  onSave,
}: PromptFormDialogProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      promptText: initialData?.promptText ?? "",
      model: initialData?.model ?? "",
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      title: initialData?.title ?? "",
      promptText: initialData?.promptText ?? "",
      model: initialData?.model ?? "",
    });
    form.clearErrors();
    setSelectedImage(null);
    setRemoveImage(false);
    form.setFocus("title");
  }, [form, initialData, open]);

  const isSaving = form.formState.isSubmitting;

  const handleSave = async (values: z.infer<typeof formSchema>) => {
    let imageUpload: PromptImageUploadInput | undefined;

    if (selectedImage) {
      imageUpload = {
        fileName: selectedImage.name,
        mimeType: selectedImage.type,
        dataBase64: await fileToBase64(selectedImage),
      };
    }

    await onSave({
      id: initialData?.id,
      title: values.title.trim(),
      promptText: values.promptText.trim(),
      model: values.model,
      folderId: initialData?.folderId ?? folderId,
      imageUpload,
      removeImage,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Prompt" : "Add New Prompt"}</DialogTitle>
          <DialogDescription>
            This prompt will be saved in {folderName}.
          </DialogDescription>
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
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input
                      {...field}
                      id="title"
                      placeholder="e.g., Cyberpunk Cityscape"
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
                name="model"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="model">AI Model</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSaving}
                    >
                      <SelectTrigger
                        id="model"
                        className="bg-primary-foreground"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent className="bg-primary-foreground">
                        {MODELS_LIST.map((model) => (
                          <SelectItem key={model.slug} value={model.slug}>
                            {model.icon}
                            {model.label}
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

              <Controller
                name="promptText"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="prompt">Prompt</FieldLabel>
                    <Textarea
                      {...field}
                      id="prompt"
                      placeholder="Enter your full prompt here..."
                      className="bg-primary-foreground h-32 resize-none"
                      data-invalid={fieldState.invalid}
                      disabled={isSaving}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Field>
                <FieldLabel htmlFor="imageFile">Example Image</FieldLabel>
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  className="bg-primary-foreground cursor-pointer"
                  disabled={isSaving}
                  onChange={(e) => {
                    const nextFile = e.target.files?.[0] ?? null;
                    setSelectedImage(nextFile);
                    if (nextFile) {
                      setRemoveImage(false);
                    }
                  }}
                />
                <p className="text-muted-foreground text-xs">
                  Upload an optional preview image. Files are stored in `prompt_images`.
                </p>
                {initialData?.imageUrl && !selectedImage && !removeImage ? (
                  <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm">
                    <span className="truncate">Current image attached</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setRemoveImage(true)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : null}
                {selectedImage ? (
                  <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm">
                    <span className="truncate">{selectedImage.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedImage(null)}
                    >
                      Clear
                    </Button>
                  </div>
                ) : null}
                {removeImage ? (
                  <p className="text-muted-foreground text-xs">
                    The current image will be removed when you save.
                  </p>
                ) : null}
              </Field>
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
                {isSaving ? "Saving..." : "Save Prompt"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
