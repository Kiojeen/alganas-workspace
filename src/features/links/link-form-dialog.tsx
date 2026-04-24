"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ArchiveLink } from "@/types";

interface LinkFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ArchiveLink | null;
}

export function LinkFormDialog({
  open,
  onOpenChange,
  initialData,
}: LinkFormDialogProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [url, setUrl] = useState(initialData?.url ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );

  const handleSave = () => {
    // Placeholder for actual save logic
    console.log("Saving Link...", { title, url, description });
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
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="link-title">Title</Label>
            <Input
              id="link-title"
              placeholder="e.g., Great UI Inspiration"
              className="bg-primary-foreground"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              type="url"
              placeholder="https://example.com"
              className="bg-primary-foreground"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="link-description">Description (Optional)</Label>
            <Textarea
              id="link-description"
              placeholder="Why are you saving this link?..."
              className="bg-primary-foreground h-24 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
