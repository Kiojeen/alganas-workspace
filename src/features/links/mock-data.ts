import type { ArchiveLink, LinkFolder } from "@/types";

export const MOCK_LINK_FOLDERS: LinkFolder[] = [
  { id: "links-inspiration", name: "Inspiration", icon: "Sparkles" },
  { id: "links-tools", name: "Tools", icon: "SquareTerminal" },
  { id: "links-reading", name: "Reading List", icon: "BookOpen" },
];

export const MOCK_LINKS: ArchiveLink[] = [
  {
    id: "link-1",
    folderId: "links-inspiration",
    title: "Awwwards - Website Inspiration",
    url: "https://www.awwwards.com/",
    description:
      "Great place to find highly creative web design trends and animation inspirations for upcoming agency projects.",
  },
  {
    id: "link-2",
    folderId: "links-tools",
    title: "shadcn/ui Documentation",
    url: "https://ui.shadcn.com/",
    description:
      "Component library reference for building out new dashboard interfaces.",
  },
  {
    id: "link-3",
    folderId: "links-inspiration",
    title: "Figma Community",
    url: "https://www.figma.com/community",
    description: "UI kits, plugins, and inspiration to borrow from quickly.",
  },
  {
    id: "link-4",
    folderId: "links-reading",
    title: "Smashing Magazine",
    url: "https://www.smashingmagazine.com/",
    description: "Long-form articles on design systems, UX, and frontend craft.",
  },
];
