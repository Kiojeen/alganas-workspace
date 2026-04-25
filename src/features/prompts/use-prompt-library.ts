"use client";

import { useEffect, useState } from "react";

import { MOCK_FOLDERS, MOCK_PROMPTS } from "./mock-data";
import { DEFAULT_FOLDER_ICON } from "@/components/folder-icons";
import type { AiPrompt, PromptFolder } from "@/types";

const STORAGE_KEY = "alganas.prompt-library";

interface PromptLibraryState {
  folders: PromptFolder[];
  prompts: AiPrompt[];
}

const DEFAULT_STATE: PromptLibraryState = {
  folders: MOCK_FOLDERS,
  prompts: MOCK_PROMPTS,
};

function normalizeFolder(folder: PromptFolder): PromptFolder {
  return {
    ...folder,
    icon: folder.icon || DEFAULT_FOLDER_ICON,
  };
}

function readStoredLibrary(): PromptLibraryState {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return DEFAULT_STATE;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<PromptLibraryState>;

    return {
      folders: (parsed.folders ?? DEFAULT_STATE.folders).map(normalizeFolder),
      prompts: parsed.prompts ?? DEFAULT_STATE.prompts,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function usePromptLibrary() {
  const [library, setLibrary] = useState<PromptLibraryState>(DEFAULT_STATE);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setLibrary(readStoredLibrary());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  }, [isReady, library]);

  const upsertFolder = (folder: PromptFolder) => {
    setLibrary((current) => {
      const exists = current.folders.some((item) => item.id === folder.id);

      return {
        ...current,
        folders: exists
          ? current.folders.map((item) => (item.id === folder.id ? folder : item))
          : [folder, ...current.folders],
      };
    });
  };

  const deleteFolder = (folderId: string) => {
    setLibrary((current) => ({
      folders: current.folders.filter((folder) => folder.id !== folderId),
      prompts: current.prompts.filter((prompt) => prompt.folderId !== folderId),
    }));
  };

  const upsertPrompt = (prompt: AiPrompt) => {
    setLibrary((current) => {
      const exists = current.prompts.some((item) => item.id === prompt.id);

      return {
        ...current,
        prompts: exists
          ? current.prompts.map((item) => (item.id === prompt.id ? prompt : item))
          : [prompt, ...current.prompts],
      };
    });
  };

  const deletePrompt = (promptId: string) => {
    setLibrary((current) => ({
      ...current,
      prompts: current.prompts.filter((prompt) => prompt.id !== promptId),
    }));
  };

  return {
    folders: library.folders,
    prompts: library.prompts,
    isReady,
    upsertFolder,
    deleteFolder,
    upsertPrompt,
    deletePrompt,
  };
}
