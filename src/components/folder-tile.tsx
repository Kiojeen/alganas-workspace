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
    <div className="group relative flex items-center gap-3 rounded-lg border border-border/60 bg-transparent p-2 transition-colors hover:bg-muted/50">
      <Link href={href} className="absolute inset-0 z-0">
        <span className="sr-only">Open {name}</span>
      </Link>

      <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <FolderIcon className="size-4" />
      </div>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col pointer-events-none">
        <h3 className="truncate text-sm leading-tight font-medium text-foreground">
          {name}
        </h3>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
          {itemCount} {itemCount === 1 ? itemLabel : `${itemLabel}s`}
        </p>
      </div>

      <div className="relative z-10 shrink-0 pr-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 text-muted-foreground opacity-0 transition-opacity hover:bg-background group-hover:opacity-100 data-[state=open]:opacity-100"
            >
              <MoreHorizontal className="size-3.5" />
              <span className="sr-only">Folder options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 rounded-lg">
            <DropdownMenuItem onClick={onEdit} className="cursor-pointer text-xs">
              <Edit2 className="mr-2 size-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="cursor-pointer text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
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
