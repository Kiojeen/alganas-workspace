"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { LinksContent } from "@/features/links/links-content";
import { PromptsContent } from "@/features/prompts/prompts-content";

export default function Home() {
  return (
    <main className="bg-background mx-auto min-h-screen max-w-7xl p-6 md:p-12">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Alganas Workspace
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage and archive your design assets.
        </p>
      </header>

      <Tabs defaultValue="ai-prompts" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="ai-prompts">AI Prompts</TabsTrigger>
          <TabsTrigger value="links">Saved Links</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-prompts" className="space-y-6">
          <PromptsContent />
        </TabsContent>

        <TabsContent value="links" className="space-y-6">
          <LinksContent />
        </TabsContent>
      </Tabs>
    </main>
  );
}
