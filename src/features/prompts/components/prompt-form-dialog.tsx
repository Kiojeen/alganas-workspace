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
  onSave: (prompt: AiPrompt) => void;
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
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");

  useEffect(() => {
    if (!open) return;

    setTitle(initialData?.title ?? "");
    setPromptText(initialData?.promptText ?? "");
    setModel(initialData?.model ?? "");
    setImageUrl(initialData?.imageUrl ?? "");
  }, [initialData, open]);

  const handleSave = () => {
    if (!title.trim() || !promptText.trim() || !model) {
      return;
    }

    onSave({
      id: initialData?.id ?? crypto.randomUUID(),
      title: title.trim(),
      promptText: promptText.trim(),
      model,
      folderId: initialData?.folderId ?? folderId,
      imageUrl: imageUrl.trim() || undefined,
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
            <Label htmlFor="imageUrl">Example Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              className="bg-primary-foreground"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              Optional preview image for this prompt.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Prompt</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
