"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Plus, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { LinkCard } from "./link-card";
import { LinkFormDialog } from "./link-form-dialog";
import { useLinkLibrary } from "./use-link-library";
import type { ArchiveLink } from "@/types";

interface FolderLinksContentProps {
  folderId: string;
}

export function FolderLinksContent({ folderId }: FolderLinksContentProps) {
  const { folders, links, isReady, upsertLink, deleteLink } = useLinkLibrary();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ArchiveLink | null>(null);

  const folder = folders.find((item) => item.id === folderId) ?? null;

  const filteredLinks = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return links.filter(
      (link) =>
        link.folderId === folderId &&
        (link.title.toLowerCase().includes(query) ||
          link.url.toLowerCase().includes(query) ||
          link.description?.toLowerCase().includes(query)),
    );
  }, [folderId, links, searchQuery]);

  const handleAddNewLink = () => {
    setEditingLink(null);
    setIsDialogOpen(true);
  };

  const handleEditLink = (link: ArchiveLink) => {
    setEditingLink(link);
    setIsDialogOpen(true);
  };

  if (isReady && !folder) {
    return (
      <div className="bg-muted/30 rounded-lg border border-dashed py-20 text-center">
        <h3 className="text-lg font-semibold">Folder not found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          This folder may have been deleted or renamed.
        </p>
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link href="/links">Back to folders</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <Button variant="ghost" className="text-sm" asChild>
            <Link href="/links" prefetch>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to folders
            </Link>
          </Button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <InputGroup className="bg-primary-foreground sm:w-80">
              <InputGroupInput
                id="link-search"
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputGroupAddon align="inline-start">
                <SearchIcon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>

            <Button onClick={handleAddNewLink} disabled={!folder}>
              <Plus className="mr-2 h-4 w-4" /> Save Link
            </Button>
          </div>
        </div>

        {filteredLinks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                linkData={link}
                onEdit={handleEditLink}
                onDelete={deleteLink}
              />
            ))}
          </div>
        ) : (
          <div className="bg-muted/30 rounded-lg border border-dashed py-20 text-center">
            <h3 className="text-lg font-semibold">
              {searchQuery ? "No links found" : "This folder is empty"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery
                ? "Try a different search inside this folder."
                : "Save your first link in this folder."}
            </p>
          </div>
        )}
      </div>

      {folder ? (
        <LinkFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          folderId={folderId}
          initialData={editingLink}
          onSave={upsertLink}
        />
      ) : null}
    </>
  );
}
