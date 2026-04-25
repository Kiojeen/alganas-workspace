import { WorkspaceShell } from "@/components/workspace-shell";
import { FolderLinksContent } from "@/features/links/folder-links-content";

interface FolderLinksPageProps {
  params: Promise<{
    folderId: string;
  }>;
}

export default async function FolderLinksPage({
  params,
}: FolderLinksPageProps) {
  const { folderId } = await params;

  return (
    <WorkspaceShell
      title="Folder Links"
      description="Create and manage the links saved inside this folder."
    >
      <FolderLinksContent folderId={folderId} />
    </WorkspaceShell>
  );
}
