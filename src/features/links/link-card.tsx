"use client";

import { useState } from "react";
import {
  Edit2 as Edit2Icon,
  ExternalLink as ExternalLinkIcon,
  Link as LinkIcon,
  Trash2 as Trash2Icon,
  Copy as CopyIcon,
  Check as CheckIcon,
  MoreHorizontal as MoreHorizontalIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ArchiveLink } from "@/types";

interface LinkCardProps {
  linkData: ArchiveLink;
  onEdit: (link: ArchiveLink) => void;
  onDelete: (id: string) => void;
}

export function LinkCard({ linkData, onEdit, onDelete }: LinkCardProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(linkData.url);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="group bg-card hover:border-primary/30 relative flex h-full flex-col gap-3 rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="bg-primary/10 text-primary group-hover:bg-primary/15 mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors">
            <LinkIcon className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className="text-foreground truncate text-base leading-tight font-semibold"
              title={linkData.title}
            >
              {linkData.title}
            </h3>

            <div className="mt-1 flex items-center gap-1.5">
              <a
                href={linkData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary truncate text-sm transition-colors hover:underline"
                title={linkData.url}
              >
                {linkData.url}
              </a>

              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted size-6 shrink-0 opacity-0 transition-all group-hover:opacity-100 focus:opacity-100"
                onClick={handleCopy}
              >
                {hasCopied ? (
                  <CheckIcon className="size-3.5 text-emerald-500" />
                ) : (
                  <CopyIcon className="text-muted-foreground size-3.5" />
                )}
                <span className="sr-only">Copy URL</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-muted size-6 shrink-0 opacity-0 transition-all group-hover:opacity-100 focus:opacity-100"
              >
                <a
                  href={linkData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLinkIcon className="text-muted-foreground size-3.5" />
                  <span className="sr-only">Visit link</span>
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="-mt-2 -mr-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground size-8 opacity-60 transition-opacity group-hover:opacity-100 hover:opacity-100 data-[state=open]:opacity-100"
              >
                <MoreHorizontalIcon className="size-4" />
                <span className="sr-only">Link options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl">
              <DropdownMenuItem
                onClick={() => onEdit(linkData)}
                className="cursor-pointer text-sm"
              >
                <Edit2Icon className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(linkData.id)}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer text-sm"
              >
                <Trash2Icon className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {linkData.description && (
        <div className="mt-1 flex-1">
          <p className="text-muted-foreground/80 line-clamp-3 text-sm leading-relaxed">
            {linkData.description}
          </p>
        </div>
      )}
    </div>
  );
}
