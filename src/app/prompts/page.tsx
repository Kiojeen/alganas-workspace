import { WorkspaceShell } from "@/components/workspace-shell";
import { PromptsContent } from "@/features/prompts/components/prompts-content";
import { requireAuth } from "@/server/better-auth/utils";

export default async function PromptsPage() {
  await requireAuth();
  return (
    <WorkspaceShell
      title="Prompt Library"
      description="Browse folders first, then step into a folder to create and manage prompts."
    >
      <PromptsContent />
    </WorkspaceShell>
  );
}
