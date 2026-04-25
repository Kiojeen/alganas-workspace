"use client";

import { useMemo, useState } from "react";
import { Plus, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Folder } from "./folder";
import { FolderFormDialog } from "./folder-form-dialog";
import { usePromptLibrary } from "../use-prompt-library";
import type { PromptFolder } from "@/types";

export function PromptsContent() {
  const { folders, prompts, upsertFolder, deleteFolder } = usePromptLibrary();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<PromptFolder | null>(null);

  const promptsByFolder = useMemo(
    () =>
      prompts.reduce<Record<string, number>>((acc, prompt) => {
        acc[prompt.folderId] = (acc[prompt.folderId] ?? 0) + 1;
        return acc;
      }, {}),
    [prompts],
  );

  const filteredFolders = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return folders.filter((folder) => {
      if (folder.name.toLowerCase().includes(query)) {
        return true;
      }

      return prompts.some(
        (prompt) =>
          prompt.folderId === folder.id &&
          (prompt.title.toLowerCase().includes(query) ||
            prompt.promptText.toLowerCase().includes(query)),
      );
    });
  }, [folders, prompts, searchQuery]);

  const handleCreateFolder = () => {
    setEditingFolder(null);
    setIsFolderDialogOpen(true);
  };

  const handleEditFolder = (folder: PromptFolder) => {
    setEditingFolder(folder);
    setIsFolderDialogOpen(true);
  };

  const handleDeleteFolder = (folder: PromptFolder) => {
    const shouldDelete = window.confirm(
      `Delete "${folder.name}" and all prompts inside it?`,
    );

    if (!shouldDelete) {
      return;
    }

    deleteFolder(folder.id);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-muted-foreground text-sm">
            Build out folders with custom icons, then open one to manage its prompts.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <InputGroup className="bg-primary-foreground sm:w-80">
              <InputGroupInput
                id="prompt-folder-search"
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

        {filteredFolders.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {filteredFolders.map((folder) => (
              <Folder
                key={folder.id}
                folder={folder}
                promptCount={promptsByFolder[folder.id] ?? 0}
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
                : "Create a folder first, then add prompts inside it."}
            </p>
          </div>
        )}
      </div>

      <FolderFormDialog
        open={isFolderDialogOpen}
        onOpenChange={setIsFolderDialogOpen}
        initialData={editingFolder}
        onSave={upsertFolder}
      />
    </>
  );
}
