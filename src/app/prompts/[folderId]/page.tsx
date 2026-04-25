import { WorkspaceShell } from "@/components/workspace-shell";
import { FolderPromptsContent } from "@/features/prompts/components/folder-prompts-content";

interface FolderPromptsPageProps {
  params: Promise<{
    folderId: string;
  }>;
}

export default async function FolderPromptsPage({
  params,
}: FolderPromptsPageProps) {
  const { folderId } = await params;

  return (
    <WorkspaceShell
      title="Folder Prompts"
      description="Create and manage the prompts saved inside this folder."
    >
      <FolderPromptsContent folderId={folderId} />
    </WorkspaceShell>
  );
}
