"use client";

import { useMemo, useState } from "react";
import { Plus, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { LinkFolder } from "./link-folder";
import { LinkFolderFormDialog } from "./link-folder-form-dialog";
import { DeleteFolderDialog } from "@/components/delete-folder-dialog";
import { useLinkLibrary } from "../use-link-library";
import type { LinkFolder as LinkFolderType } from "@/types";

export function LinksContent() {
  const { folders, links, isLoading, upsertFolder, deleteFolder } =
    useLinkLibrary();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const[editingFolder, setEditingFolder] = useState<LinkFolderType | null>(
    null,
  );
  const [folderToDelete, setFolderToDelete] = useState<LinkFolderType | null>(
    null,
  );

  const linksByFolder = useMemo(
    () =>
      links.reduce<Record<string, number>>((acc, link) => {
        acc[link.folderId] = (acc[link.folderId] ?? 0) + 1;
        return acc;
      }, {}),[links],
  );

  const filteredFolders = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return folders.filter((folder) => {
      if (folder.name.toLowerCase().includes(query)) {
        return true;
      }

      return links.some(
        (link) =>
          link.folderId === folder.id &&
          (link.title.toLowerCase().includes(query) ||
            link.url.toLowerCase().includes(query) ||
            link.description?.toLowerCase().includes(query)),
      );
    });
  }, [folders, links, searchQuery]);

  const handleCreateFolder = () => {
    setEditingFolder(null);
    setIsFolderDialogOpen(true);
  };

  const handleEditFolder = (folder: LinkFolderType) => {
    setEditingFolder(folder);
    setIsFolderDialogOpen(true);
  };

  const handleDeleteFolder = (folder: LinkFolderType) => {
    setFolderToDelete(folder);
  };

  const confirmDeleteFolder = async () => {
    if (!folderToDelete) return;
    await deleteFolder(folderToDelete.id);
    setFolderToDelete(null);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-muted-foreground text-sm">
            Organize references into folders with custom icons, then open one to manage its links.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <InputGroup className="bg-primary-foreground sm:w-80">
              <InputGroupInput
                id="link-folder-search"
                placeholder="Search folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputGroupAddon align="inline-start">
                <SearchIcon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>

            <Button onClick={handleCreateFolder}>
              <Plus className="mr-2 h-4 w-4" /> Add Folder
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-muted/30 rounded-lg border border-dashed py-20 text-center">
            <h3 className="text-lg font-semibold">Loading folders...</h3>
          </div>
        ) : filteredFolders.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {filteredFolders.map((folder) => (
              <LinkFolder
                key={folder.id}
                folder={folder}
                linkCount={linksByFolder[folder.id] ?? 0}
                onEdit={handleEditFolder}
                onDelete={handleDeleteFolder}
              />
            ))}
          </div>
        ) : (
          <div className="bg-muted/30 rounded-lg border border-dashed py-20 text-center">
            <h3 className="text-lg font-semibold">
              {searchQuery ? "No folders found" : "No folders yet"}
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              {searchQuery
                ? "Try a different search term."
                : "Create a folder first, then save links inside it."}
            </p>
          </div>
        )}
      </div>

      <LinkFolderFormDialog
        open={isFolderDialogOpen}
        onOpenChange={setIsFolderDialogOpen}
        initialData={editingFolder}
        onSave={upsertFolder}
      />

      <DeleteFolderDialog
        open={!!folderToDelete}
        folderName={folderToDelete?.name ?? ""}
        onConfirm={confirmDeleteFolder}
        onCancel={() => setFolderToDelete(null)}
      />
    </>
  );
}