"use client";

import { useEffect, useState } from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PromptFolderUpsertInput } from "@/features/prompts/use-prompt-library";
import type { PromptFolder } from "@/types";

interface FolderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: PromptFolder | null;
  onSave: (folder: PromptFolderUpsertInput) => Promise<void>;
}

export function FolderFormDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: FolderFormDialogProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [icon, setIcon] = useState(initialData?.icon ?? DEFAULT_FOLDER_ICON);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(initialData?.name ?? "");
    setIcon(initialData?.icon ?? DEFAULT_FOLDER_ICON);
  }, [initialData, open]);

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        id: initialData?.id,
        name: trimmedName,
        icon,
      });
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Folder" : "Create Folder"}
          </DialogTitle>
          <DialogDescription>
            Choose a name and assign an icon for this folder.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="grid gap-2">
            <Label htmlFor="folder-name">Folder name</Label>
            <Input
              id="folder-name"
              value={name}
              placeholder="e.g. Client Work"
              className="bg-primary-foreground"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <FolderIconPicker value={icon} onChange={setIcon} />
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
            {isSaving
              ? "Saving..."
              : initialData
                ? "Save Changes"
                : "Create Folder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
