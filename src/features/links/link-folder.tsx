"use client";

import { FolderTile } from "@/components/folder-tile";
import type { LinkFolder } from "@/types";

interface LinkFolderProps {
  folder: LinkFolder;
  linkCount: number;
  onEdit: (folder: LinkFolder) => void;
  onDelete: (folder: LinkFolder) => void;
}

export function LinkFolder({
  folder,
  linkCount,
  onEdit,
  onDelete,
}: LinkFolderProps) {
  return (
    <FolderTile
      href={`/links/${folder.id}`}
      name={folder.name}
      icon={folder.icon}
      itemCount={linkCount}
      itemLabel="link"
      onEdit={() => onEdit(folder)}
      onDelete={() => onDelete(folder)}
    />
  );
}
