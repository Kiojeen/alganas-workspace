"use client";

import Link from "next/link";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFolderIcon } from "@/components/folder-icons";

interface FolderTileProps {
  href: string;
  name: string;
  icon: string;
  itemCount: number;
  itemLabel: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function FolderTile({
  href,
  name,
  icon,
  itemCount,
  itemLabel,
  onEdit,
  onDelete,
}: FolderTileProps) {
  const FolderIcon = getFolderIcon(icon);

  return (
    <div className="group border-border/60 hover:bg-muted/50 relative flex items-center gap-3 rounded-lg border bg-transparent p-2 transition-colors">
      <Link href={href} className="absolute inset-0 z-0">
        <span className="sr-only">Open {name}</span>
      </Link>

      <div className="bg-primary/10 text-primary relative z-10 flex size-8 shrink-0 items-center justify-center rounded-md">
        <FolderIcon className="size-4" />
      </div>

      <div className="pointer-events-none relative z-10 flex min-w-0 flex-1 flex-col">
        <h3 className="text-foreground truncate text-sm leading-tight font-medium">
          {name}
        </h3>
        <p className="text-muted-foreground mt-0.5 truncate text-[11px]">
          {itemCount} {itemCount === 1 ? itemLabel : `${itemLabel}s`}
        </p>
      </div>

      <div className="relative z-10 shrink-0 pr-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:bg-background size-6 transition-opacity"
            >
              <MoreHorizontal className="size-3.5" />
              <span className="sr-only">Folder options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 rounded-lg">
            <DropdownMenuItem
              onClick={onEdit}
              className="cursor-pointer text-xs"
            >
              <Edit2 className="mr-2 size-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer text-xs"
            >
              <Trash2 className="mr-2 size-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
