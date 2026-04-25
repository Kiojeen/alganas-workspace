import { WorkspaceShell } from "@/components/workspace-shell";
import { PromptsContent } from "@/features/prompts/components/prompts-content";

export default function PromptsPage() {
  return (
    <WorkspaceShell
      title="Prompt Library"
      description="Browse folders first, then step into a folder to create and manage prompts."
    >
      <PromptsContent />
    </WorkspaceShell>
  );
}
