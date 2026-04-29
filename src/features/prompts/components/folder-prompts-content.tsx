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
import { PromptCard } from "./prompt-card";
import { PromptFormDialog } from "./prompt-form-dialog";
import { usePromptLibrary } from "../use-prompt-library";
import type { AiPrompt } from "@/types";

interface FolderPromptsContentProps {
  folderId: string;
}

export function FolderPromptsContent({ folderId }: FolderPromptsContentProps) {
  const { folders, prompts, isLoading, isReady, upsertPrompt, deletePrompt } =
    usePromptLibrary();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<AiPrompt | null>(null);

  const folder = folders.find((item) => item.id === folderId) ?? null;

  const filteredPrompts = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return prompts.filter(
      (prompt) =>
        prompt.folderId === folderId &&
        (prompt.title.toLowerCase().includes(query) ||
          prompt.promptText.toLowerCase().includes(query)),
    );
  }, [folderId, prompts, searchQuery]);

  const handleAddNewPrompt = () => {
    setEditingPrompt(null);
    setIsDialogOpen(true);
  };

  const handleEditPrompt = (prompt: AiPrompt) => {
    setEditingPrompt(prompt);
    setIsDialogOpen(true);
  };

  if (isReady && !folder) {
    return (
      <div className="bg-muted/30 rounded-lg border border-dashed py-20 text-center">
        <h3 className="text-lg font-semibold">Folder not found</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          This folder may have been deleted or renamed.
        </p>
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link href="/prompts">Back to folders</Link>
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
            <Link href="/prompts" prefetch>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to folders
            </Link>
          </Button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <InputGroup className="bg-primary-foreground sm:w-80">
              <InputGroupInput
                id="prompt-search"
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputGroupAddon align="inline-start">
                <SearchIcon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>

            <Button onClick={handleAddNewPrompt} disabled={!folder}>
              <Plus className="mr-2 h-4 w-4" /> Add Prompt
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-muted/30 rounded-lg border border-dashed py-20 text-center">
            <h3 className="text-lg font-semibold">Loading prompts...</h3>
          </div>
        ) : filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onEdit={handleEditPrompt}
                onDelete={deletePrompt}
              />
            ))}
          </div>
        ) : (
          <div className="bg-muted/30 rounded-lg border border-dashed py-20 text-center">
            <h3 className="text-lg font-semibold">
              {searchQuery ? "No prompts found" : "This folder is empty"}
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              {searchQuery
                ? "Try a different search inside this folder."
                : "Create your first prompt in this folder."}
            </p>
          </div>
        )}
      </div>

      {folder ? (
        <PromptFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          folderId={folderId}
          folderName={folder.name}
          initialData={editingPrompt}
          onSave={upsertPrompt}
        />
      ) : null}
    </>
  );
}
