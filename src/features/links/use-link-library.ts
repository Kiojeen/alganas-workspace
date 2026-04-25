"use client";

import { useEffect, useState } from "react";

import { DEFAULT_FOLDER_ICON } from "@/components/folder-icons";
import { MOCK_LINK_FOLDERS, MOCK_LINKS } from "@/features/links/mock-data";
import type { ArchiveLink, LinkFolder } from "@/types";

const STORAGE_KEY = "alganas.link-library";

interface LinkLibraryState {
  folders: LinkFolder[];
  links: ArchiveLink[];
}

const DEFAULT_STATE: LinkLibraryState = {
  folders: MOCK_LINK_FOLDERS,
  links: MOCK_LINKS,
};

function normalizeFolder(folder: LinkFolder): LinkFolder {
  return {
    ...folder,
    icon: folder.icon || DEFAULT_FOLDER_ICON,
  };
}

function readStoredLibrary(): LinkLibraryState {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return DEFAULT_STATE;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<LinkLibraryState>;

    return {
      folders: (parsed.folders ?? DEFAULT_STATE.folders).map(normalizeFolder),
      links: parsed.links ?? DEFAULT_STATE.links,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function useLinkLibrary() {
  const [library, setLibrary] = useState<LinkLibraryState>(DEFAULT_STATE);
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

  const upsertFolder = (folder: LinkFolder) => {
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
      links: current.links.filter((link) => link.folderId !== folderId),
    }));
  };

  const upsertLink = (link: ArchiveLink) => {
    setLibrary((current) => {
      const exists = current.links.some((item) => item.id === link.id);

      return {
        ...current,
        links: exists
          ? current.links.map((item) => (item.id === link.id ? link : item))
          : [link, ...current.links],
      };
    });
  };

  const deleteLink = (linkId: string) => {
    setLibrary((current) => ({
      ...current,
      links: current.links.filter((link) => link.id !== linkId),
    }));
  };

  return {
    folders: library.folders,
    links: library.links,
    isReady,
    upsertFolder,
    deleteFolder,
    upsertLink,
    deleteLink,
  };
}
