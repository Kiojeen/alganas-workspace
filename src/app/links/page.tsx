import { WorkspaceShell } from "@/components/workspace-shell";
import { LinksContent } from "@/features/links/links-content";

export default function LinksPage() {
  return (
    <WorkspaceShell
      title="Link Library"
      description="Browse folders first, then step into a folder to create and manage saved links."
    >
      <LinksContent />
    </WorkspaceShell>
  );
}
