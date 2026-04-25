"use client";

import { FolderTile } from "@/components/folder-tile";
import type { PromptFolder } from "@/types";

interface FolderProps {
  folder: PromptFolder;
  promptCount: number;
  onEdit: (folder: PromptFolder) => void;
  onDelete: (folder: PromptFolder) => void;
}

export function Folder({ folder, promptCount, onEdit, onDelete }: FolderProps) {
  return (
    <FolderTile
      href={`/prompts/${folder.id}`}
      name={folder.name}
      icon={folder.icon}
      itemCount={promptCount}
      itemLabel="prompt"
      onEdit={() => onEdit(folder)}
      onDelete={() => onDelete(folder)}
    />
  );
}
