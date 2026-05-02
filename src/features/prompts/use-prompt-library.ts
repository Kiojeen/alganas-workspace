"use client";

import { api } from "@/trpc/react";
import type { AiPrompt, PromptFolder } from "@/types";

export interface PromptImageUploadInput {
  dataBase64: string;
  fileName: string;
  mimeType: string;
}

export interface PromptUpsertInput {
  folderId: string;
  id?: string;
  imageUpload?: PromptImageUploadInput;
  model: string;
  description?: string;
  promptText: string;
  removeImage?: boolean;
  title: string;
}

export interface PromptFolderUpsertInput {
  icon: string;
  id?: string;
  name: string;
}

export function usePromptLibrary() {
  api.prompts.getLibrary.usePrefetchQuery();
  const utils = api.useUtils();
  const libraryQuery = api.prompts.getLibrary.useQuery();

  const invalidateLibrary = () => utils.prompts.getLibrary.invalidate();

  const upsertFolderMutation = api.prompts.upsertFolder.useMutation({
    onSuccess: invalidateLibrary,
  });
  const deleteFolderMutation = api.prompts.deleteFolder.useMutation({
    onSuccess: invalidateLibrary,
  });
  const upsertPromptMutation = api.prompts.upsertPrompt.useMutation({
    onSuccess: invalidateLibrary,
  });
  const deletePromptMutation = api.prompts.deletePrompt.useMutation({
    onSuccess: invalidateLibrary,
  });

  const folders: PromptFolder[] =
    libraryQuery.data?.map((folder) => ({
      id: folder.id,
      name: folder.name,
      icon: folder.icon,
    })) ?? [];

  const prompts: AiPrompt[] =
    libraryQuery.data?.flatMap((folder) =>
      folder.prompts.map((prompt) => ({
        id: prompt.id,
        folderId: prompt.folderId,
        title: prompt.title,
        description: prompt.description ?? undefined,
        promptText: prompt.promptText,
        model: prompt.model,
        imageUrl: prompt.imageUrl ?? undefined,
      })),
    ) ?? [];

  return {
    folders,
    prompts,
    isLoading: libraryQuery.isLoading,
    isReady: !libraryQuery.isLoading,
    upsertFolder: async (folder: PromptFolderUpsertInput) => {
      await upsertFolderMutation.mutateAsync(folder);
    },
    deleteFolder: async (folderId: string) => {
      await deleteFolderMutation.mutateAsync({ folderId });
    },
    upsertPrompt: async (prompt: PromptUpsertInput) => {
      await upsertPromptMutation.mutateAsync(prompt);
    },
    deletePrompt: async (promptId: string) => {
      await deletePromptMutation.mutateAsync({ promptId });
    },
  };
}
