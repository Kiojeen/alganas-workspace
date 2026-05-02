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
import { Folder } from "./folder";
import { FolderFormDialog } from "./folder-form-dialog";
import { DeleteFolderDialog } from "@/components/delete-folder-dialog";
import { usePromptLibrary } from "../use-prompt-library";
import { PromptCard } from "./prompt-card";
import { PromptFormDialog } from "./prompt-form-dialog";
import type { AiPrompt, PromptFolder } from "@/types";

type ViewMode = "folders" | "all";

function promptMatchesSearch(prompt: AiPrompt, query: string) {
  return (
    prompt.title.toLowerCase().includes(query) ||
    prompt.description?.toLowerCase().includes(query) ||
    prompt.promptText.toLowerCase().includes(query)
  );
}

export function PromptsContent() {
  const {
    folders,
    prompts,
    isLoading,
    upsertFolder,
    deleteFolder,
    upsertPrompt,
    deletePrompt,
  } = usePromptLibrary();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("folders");
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);
  const[editingFolder, setEditingFolder] = useState<PromptFolder | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<AiPrompt | null>(null);
  
  const [folderToDelete, setFolderToDelete] = useState<PromptFolder | null>(null);

  const folderNameById = useMemo(
    () => new Map(folders.map((folder) => [folder.id, folder.name])),
    [folders],
  );

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
          promptMatchesSearch(prompt, query),
      );
    });
  },[folders, prompts, searchQuery]);

  const filteredPrompts = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return prompts.filter((prompt) => promptMatchesSearch(prompt, query));
  }, [prompts, searchQuery]);

  const handleCreateFolder = () => {
    setEditingFolder(null);
    setIsFolderDialogOpen(true);
  };

  const handleAddNewPrompt = () => {
    setEditingPrompt(null);
    setIsPromptDialogOpen(true);
  };

  const handleEditFolder = (folder: PromptFolder) => {
    setEditingFolder(folder);
    setIsFolderDialogOpen(true);
  };

  const handleEditPrompt = (prompt: AiPrompt) => {
    setEditingPrompt(prompt);
    setIsPromptDialogOpen(true);
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

  const handleDeleteFolder = (folder: PromptFolder) => {
    setFolderToDelete(folder);
  };

  const handleSavePrompt = async (prompt: Parameters<typeof upsertPrompt>[0]) => {
    try {
      await upsertPrompt(prompt);
      toast.success(prompt.id ? "Prompt updated." : "Prompt created.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save prompt.");
      throw error;
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    try {
      await deletePrompt(promptId);
      toast.success("Prompt deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete prompt.");
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
              ? "Build out folders with custom icons, then open one to manage its prompts."
              : "Search and manage every prompt across your folders."}
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
                id="prompt-folder-search"
                placeholder={
                  viewMode === "folders"
                    ? "Search folders..."
                    : "Search prompts..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputGroupAddon align="inline-start">
                <SearchIcon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>

            <Button
              onClick={
                viewMode === "folders" ? handleCreateFolder : handleAddNewPrompt
              }
              disabled={viewMode === "all" && folders.length === 0}
            >
              <Plus className="mr-2 h-4 w-4" />
              {viewMode === "folders" ? "Add Folder" : "Add Prompt"}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-muted/30 rounded-lg border border-dashed py-20 text-center">
            <h3 className="text-lg font-semibold">
              Loading {viewMode === "folders" ? "folders" : "prompts"}...
            </h3>
          </div>
        ) : viewMode === "folders" && filteredFolders.length > 0 ? (
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
        ) : viewMode === "all" && filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                folderName={folderNameById.get(prompt.folderId)}
                onEdit={handleEditPrompt}
                onDelete={handleDeletePrompt}
              />
            ))}
          </div>
        ) : (
          <div className="bg-muted/30 rounded-lg border border-dashed py-20 text-center">
            <h3 className="text-lg font-semibold">
              {searchQuery
                ? viewMode === "folders"
                  ? "No folders found"
                  : "No prompts found"
                : viewMode === "folders"
                  ? "No folders yet"
                  : "No prompts yet"}
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              {searchQuery
                ? "Try a different search term."
                : viewMode === "folders"
                  ? "Create a folder first, then add prompts inside it."
                  : folders.length === 0
                    ? "Create a folder before adding prompts."
                    : "Add your first prompt from here or inside a folder."}
            </p>
          </div>
        )}
      </div>

      <FolderFormDialog
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

      <PromptFormDialog
        open={isPromptDialogOpen}
        onOpenChange={setIsPromptDialogOpen}
        folderChoices={folders}
        initialData={editingPrompt}
        onSave={handleSavePrompt}
      />
    </>
  );
}
