import { WorkspaceShell } from "@/components/workspace-shell";
import { LinksContent } from "@/features/links/components/links-content";
import { requireAuth } from "@/server/better-auth/utils";

export default async function LinksPage() {
  await requireAuth();
  return (
    <WorkspaceShell
      title="Link Library"
      description="Browse folders first, then step into a folder to create and manage saved links."
    >
      <LinksContent />
    </WorkspaceShell>
  );
}
