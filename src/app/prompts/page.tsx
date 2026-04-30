import { WorkspaceShell } from "@/components/workspace-shell";
import { PromptsContent } from "@/features/prompts/components/prompts-content";
import { requireAuth } from "@/server/better-auth/utils";
import { api, HydrateClient } from "@/trpc/server";

export default async function PromptsPage() {
  await requireAuth();
  await api.prompts.getLibrary.prefetch();

  return (
    <HydrateClient>
      <WorkspaceShell
        title="Prompt Library"
        description="Browse folders first, then step into a folder to create and manage prompts."
      >
        <PromptsContent />
      </WorkspaceShell>
    </HydrateClient>
  );
}
