"use client";

import { api } from "@/trpc/react";
import type { ArchiveLink, LinkFolder } from "@/types";

export interface LinkFolderUpsertInput {
  icon: string;
  id?: string;
  name: string;
}

export interface LinkUpsertInput {
  description?: string;
  folderId: string;
  id?: string;
  title: string;
  url: string;
}

export function useLinkLibrary() {
  const utils = api.useUtils();
  const libraryQuery = api.links.getLibrary.useQuery();

  const invalidateLibrary = () => utils.links.getLibrary.invalidate();

  const upsertFolderMutation = api.links.upsertFolder.useMutation({
    onSuccess: invalidateLibrary,
  });
  const deleteFolderMutation = api.links.deleteFolder.useMutation({
    onSuccess: invalidateLibrary,
  });
  const upsertLinkMutation = api.links.upsertLink.useMutation({
    onSuccess: invalidateLibrary,
  });
  const deleteLinkMutation = api.links.deleteLink.useMutation({
    onSuccess: invalidateLibrary,
  });

  const folders: LinkFolder[] =
    libraryQuery.data?.folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      icon: folder.icon,
    })) ?? [];

  const links: ArchiveLink[] =
    libraryQuery.data?.links.map((link) => ({
      id: link.id,
      folderId: link.folderId,
      title: link.title,
      url: link.url,
      description: link.description ?? undefined,
    })) ?? [];

  return {
    folders,
    links,
    isLoading: libraryQuery.isLoading,
    isReady: !libraryQuery.isLoading,
    upsertFolder: async (folder: LinkFolderUpsertInput) => {
      await upsertFolderMutation.mutateAsync(folder);
    },
    deleteFolder: async (folderId: string) => {
      await deleteFolderMutation.mutateAsync({ folderId });
    },
    upsertLink: async (link: LinkUpsertInput) => {
      await upsertLinkMutation.mutateAsync(link);
    },
    deleteLink: async (linkId: string) => {
      await deleteLinkMutation.mutateAsync({ linkId });
    },
  };
}
