"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [promptText, setPromptText] = useState(initialData?.promptText ?? "");
  const [model, setModel] = useState(initialData?.model ?? "");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setTitle(initialData?.title ?? "");
    setPromptText(initialData?.promptText ?? "");
    setModel(initialData?.model ?? "");
    setSelectedImage(null);
    setRemoveImage(false);
  }, [initialData, open]);

  const handleSave = async () => {
    if (!title.trim() || !promptText.trim() || !model) {
      return;
    }

    let imageUpload: PromptImageUploadInput | undefined;

    if (selectedImage) {
      imageUpload = {
        fileName: selectedImage.name,
        mimeType: selectedImage.type,
        dataBase64: await fileToBase64(selectedImage),
      };
    }

    setIsSaving(true);
    try {
      await onSave({
        id: initialData?.id,
        title: title.trim(),
        promptText: promptText.trim(),
        model,
        folderId: initialData?.folderId ?? folderId,
        imageUpload,
        removeImage,
      });

      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
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
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Cyberpunk Cityscape"
              className="bg-primary-foreground"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="model">AI Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="bg-primary-foreground">
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
          </div>
          <div className="grid gap-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Enter your full prompt here..."
              className="bg-primary-foreground h-32 resize-none"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="imageFile">Example Image</Label>
            <Input
              id="imageFile"
              type="file"
              accept="image/*"
              className="bg-primary-foreground cursor-pointer"
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
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Prompt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
