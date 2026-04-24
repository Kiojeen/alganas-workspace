"use client";

import { useState } from "react";
import { Plus, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { LinkCard } from "./link-card";
import { LinkFormDialog } from "./link-form-dialog";
import type { ArchiveLink } from "@/types";

const MOCK_LINKS: ArchiveLink[] = [
  {
    id: "1",
    title: "Awwwards - Website Inspiration",
    url: "https://www.awwwards.com/",
    description:
      "Great place to find highly creative web design trends and animation inspirations for upcoming agency projects.",
  },
  {
    id: "2",
    title: "Shadcn UI Documentation",
    url: "https://ui.shadcn.com/",
    description:
      "Component library reference for building out the new dashboard interfaces.",
  },
  {
    id: "3",
    title: "Figma Community",
    url: "https://www.figma.com/community",
  },
];

export function LinksContent() {
  const [links, setLinks] = useState<ArchiveLink[]>(MOCK_LINKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ArchiveLink | null>(null);

  const filteredLinks = links.filter(
    (link) =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddNewLink = () => {
    setEditingLink(null);
    setIsDialogOpen(true);
  };

  const handleEditLink = (link: ArchiveLink) => {
    setEditingLink(link);
    setIsDialogOpen(true);
  };

  const handleDeleteLink = (id: string) => {
    setLinks((currentLinks) => currentLinks.filter((link) => link.id !== id));
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <InputGroup className="bg-primary-foreground sm:max-w-sm">
          <InputGroupInput
            id="link-search"
            placeholder="Search links, URLs or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
        <Button onClick={handleAddNewLink}>
          <Plus className="mr-2 h-4 w-4" /> Save Link
        </Button>
      </div>

      {filteredLinks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLinks.map((link) => (
            <LinkCard
              key={link.id}
              linkData={link}
              onEdit={handleEditLink}
              onDelete={handleDeleteLink}
            />
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 rounded-lg border border-dashed py-20 text-center">
          <h3 className="text-lg font-semibold">No links found</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Try adjusting your search or save a new link.
          </p>
        </div>
      )}

      {isDialogOpen && (
        <LinkFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          initialData={editingLink}
        />
      )}
    </>
  );
}
