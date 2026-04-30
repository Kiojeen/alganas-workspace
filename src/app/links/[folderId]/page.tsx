import { WorkspaceShell } from "@/components/workspace-shell";
import { FolderLinksContent } from "@/features/links/components/folder-links-content";
import { requireAuth } from "@/server/better-auth/utils";
import { api, HydrateClient } from "@/trpc/server";

interface FolderLinksPageProps {
  params: Promise<{
    folderId: string;
  }>;
}

export default async function FolderLinksPage({
  params,
}: FolderLinksPageProps) {
  const { folderId } = await params;
  await requireAuth();
  await api.links.getLibrary.prefetch();

  return (
    <HydrateClient>
      <WorkspaceShell
        title="Folder Links"
        description="Create and manage the links saved inside this folder."
      >
        <FolderLinksContent folderId={folderId} />
      </WorkspaceShell>
    </HydrateClient>
  );
}
