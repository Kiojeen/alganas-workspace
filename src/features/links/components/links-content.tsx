"use client";

import { useMemo, useState } from "react";
import { Plus, SearchIcon } from "lucide-react";
import { toast } from "sonner";

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
import { LinkCard } from "./link-card";
import { LinkFormDialog } from "./link-form-dialog";
import type { ArchiveLink, LinkFolder as LinkFolderType } from "@/types";

type ViewMode = "folders" | "all";

function linkMatchesSearch(link: ArchiveLink, query: string) {
  return (
    link.title.toLowerCase().includes(query) ||
    link.url.toLowerCase().includes(query) ||
    link.description?.toLowerCase().includes(query)
  );
}

export function LinksContent() {
  const {
    folders,
    links,
    isLoading,
    upsertFolder,
    deleteFolder,
    upsertLink,
    deleteLink,
  } = useLinkLibrary();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("folders");
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const[editingFolder, setEditingFolder] = useState<LinkFolderType | null>(
    null,
  );
  const [editingLink, setEditingLink] = useState<ArchiveLink | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<LinkFolderType | null>(
    null,
  );

  const folderNameById = useMemo(
    () => new Map(folders.map((folder) => [folder.id, folder.name])),
    [folders],
  );

  const linksByFolder = useMemo(
    () =>
      links.reduce<Record<string, number>>((acc, link) => {
        acc[link.folderId] = (acc[link.folderId] ?? 0) + 1;
        return acc;
      }, {}),[links],
  );

  const filteredLinks = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return links.filter((link) => linkMatchesSearch(link, query));
  }, [links, searchQuery]);

  const filteredFolders = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return folders.filter((folder) => {
      if (folder.name.toLowerCase().includes(query)) {
        return true;
      }

      return links.some(
        (link) =>
          link.folderId === folder.id && linkMatchesSearch(link, query),
      );
    });
  }, [folders, links, searchQuery]);

  const handleCreateFolder = () => {
    setEditingFolder(null);
    setIsFolderDialogOpen(true);
  };

  const handleAddNewLink = () => {
    setEditingLink(null);
    setIsLinkDialogOpen(true);
  };

  const handleEditFolder = (folder: LinkFolderType) => {
    setEditingFolder(folder);
    setIsFolderDialogOpen(true);
  };

  const handleEditLink = (link: ArchiveLink) => {
    setEditingLink(link);
    setIsLinkDialogOpen(true);
  };

  const handleSaveFolder = async (folder: Parameters<typeof upsertFolder>[0]) => {
    try {
      await upsertFolder(folder);
      toast.success(folder.id ? "Folder updated." : "Folder created.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save folder.");
      throw error;
    }
  };

  const handleDeleteFolder = (folder: LinkFolderType) => {
    setFolderToDelete(folder);
  };

  const handleSaveLink = async (link: Parameters<typeof upsertLink>[0]) => {
    try {
      await upsertLink(link);
      toast.success(link.id ? "Link updated." : "Link saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save link.");
      throw error;
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await deleteLink(linkId);
      toast.success("Link deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete link.");
    }
  };

  const confirmDeleteFolder = async () => {
    if (!folderToDelete) return;
    try {
      await deleteFolder(folderToDelete.id);
      toast.success("Folder deleted.");
      setFolderToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete folder.");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-muted-foreground text-sm">
            {viewMode === "folders"
              ? "Organize references into folders with custom icons, then open one to manage its links."
              : "Search and manage every saved link across your folders."}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="bg-muted flex rounded-lg p-1">
              <Button
                type="button"
                variant={viewMode === "folders" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("folders")}
              >
                Folders
              </Button>
              <Button
                type="button"
                variant={viewMode === "all" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("all")}
              >
                All
              </Button>
            </div>

            <InputGroup className="bg-primary-foreground sm:w-80">
              <InputGroupInput
                id="link-folder-search"
                placeholder={
                  viewMode === "folders" ? "Search folders..." : "Search links..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputGroupAddon align="inline-start">
                <SearchIcon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>

            <Button
              onClick={viewMode === "folders" ? handleCreateFolder : handleAddNewLink}
              disabled={viewMode === "all" && folders.length === 0}
            >
              <Plus className="mr-2 h-4 w-4" />
              {viewMode === "folders" ? "Add Folder" : "Save Link"}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-muted/30 rounded-lg border border-dashed py-20 text-center">
            <h3 className="text-lg font-semibold">
              Loading {viewMode === "folders" ? "folders" : "links"}...
            </h3>
          </div>
        ) : viewMode === "folders" && filteredFolders.length > 0 ? (
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
        ) : viewMode === "all" && filteredLinks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                linkData={link}
                folderName={folderNameById.get(link.folderId)}
                onEdit={handleEditLink}
                onDelete={handleDeleteLink}
              />
            ))}
          </div>
        ) : (
          <div className="bg-muted/30 rounded-lg border border-dashed py-20 text-center">
            <h3 className="text-lg font-semibold">
              {searchQuery
                ? viewMode === "folders"
                  ? "No folders found"
                  : "No links found"
                : viewMode === "folders"
                  ? "No folders yet"
                  : "No links yet"}
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              {searchQuery
                ? "Try a different search term."
                : viewMode === "folders"
                  ? "Create a folder first, then save links inside it."
                  : folders.length === 0
                    ? "Create a folder before saving links."
                    : "Save your first link from here or inside a folder."}
            </p>
          </div>
        )}
      </div>

      <LinkFolderFormDialog
        open={isFolderDialogOpen}
        onOpenChange={setIsFolderDialogOpen}
        initialData={editingFolder}
        onSave={handleSaveFolder}
      />

      <DeleteFolderDialog
        open={!!folderToDelete}
        folderName={folderToDelete?.name ?? ""}
        onConfirm={confirmDeleteFolder}
        onCancel={() => setFolderToDelete(null)}
      />

      <LinkFormDialog
        open={isLinkDialogOpen}
        onOpenChange={setIsLinkDialogOpen}
        folderChoices={folders}
        initialData={editingLink}
        onSave={handleSaveLink}
      />
    </>
  );
}
