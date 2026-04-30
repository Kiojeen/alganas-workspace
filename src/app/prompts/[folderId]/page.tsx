import { WorkspaceShell } from "@/components/workspace-shell";
import { FolderPromptsContent } from "@/features/prompts/components/folder-prompts-content";
import { requireAuth } from "@/server/better-auth/utils";
import { api, HydrateClient } from "@/trpc/server";

interface FolderPromptsPageProps {
  params: Promise<{
    folderId: string;
  }>;
}

export default async function FolderPromptsPage({
  params,
}: FolderPromptsPageProps) {
  const { folderId } = await params;
  await requireAuth();
  await api.prompts.getLibrary.prefetch();

  return (
    <HydrateClient>
      <WorkspaceShell
        title="Folder Prompts"
        description="Create and manage the prompts saved inside this folder."
      >
        <FolderPromptsContent folderId={folderId} />
      </WorkspaceShell>
    </HydrateClient>
  );
}
