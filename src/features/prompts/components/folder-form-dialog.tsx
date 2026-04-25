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
import type { PromptFolder } from "@/types";

interface FolderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: PromptFolder | null;
  onSave: (folder: PromptFolder) => void;
}

export function FolderFormDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: FolderFormDialogProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [icon, setIcon] = useState(initialData?.icon ?? DEFAULT_FOLDER_ICON);

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(initialData?.name ?? "");
    setIcon(initialData?.icon ?? DEFAULT_FOLDER_ICON);
  }, [initialData, open]);

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    onSave({
      id: initialData?.id ?? crypto.randomUUID(),
      name: trimmedName,
      icon,
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {initialData ? "Save Changes" : "Create Folder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
