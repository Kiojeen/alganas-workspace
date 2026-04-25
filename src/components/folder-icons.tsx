"use client";

import type { LucideIcon } from "lucide-react";
import {
  Archive,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Brush,
  Camera,
  CircleEllipsis,
  Clapperboard,
  Code2,
  Compass,
  FileText,
  Film,
  FolderKanban,
  Gem,
  Globe,
  Heart,
  ImageIcon,
  LayoutGrid,
  Lightbulb,
  MessageSquareQuote,
  Mic,
  Music4,
  NotebookPen,
  Palette,
  PenTool,
  Rocket,
  ScanSearch,
  ShoppingBag,
  Sparkles,
  SquareTerminal,
  Star,
  Sticker,
  Swords,
  WandSparkles,
} from "lucide-react";

export interface FolderIconOption {
  name: string;
  icon: LucideIcon;
  label: string;
}

export const FOLDER_ICON_OPTIONS: FolderIconOption[] = [
  { name: "FolderKanban", icon: FolderKanban, label: "General" },
  { name: "Palette", icon: Palette, label: "Design" },
  { name: "PenTool", icon: PenTool, label: "Writing" },
  { name: "Briefcase", icon: Briefcase, label: "Business" },
  { name: "Lightbulb", icon: Lightbulb, label: "Ideas" },
  { name: "Rocket", icon: Rocket, label: "Launch" },
  { name: "Sparkles", icon: Sparkles, label: "Creative" },
  { name: "WandSparkles", icon: WandSparkles, label: "Magic" },
  { name: "ImageIcon", icon: ImageIcon, label: "Image" },
  { name: "Camera", icon: Camera, label: "Photo" },
  { name: "Film", icon: Film, label: "Video" },
  { name: "Clapperboard", icon: Clapperboard, label: "Media" },
  { name: "Music4", icon: Music4, label: "Music" },
  { name: "Mic", icon: Mic, label: "Audio" },
  { name: "Code2", icon: Code2, label: "Code" },
  { name: "SquareTerminal", icon: SquareTerminal, label: "Terminal" },
  { name: "Globe", icon: Globe, label: "Web" },
  { name: "ShoppingBag", icon: ShoppingBag, label: "Commerce" },
  { name: "BookOpen", icon: BookOpen, label: "Reading" },
  { name: "NotebookPen", icon: NotebookPen, label: "Notes" },
  { name: "FileText", icon: FileText, label: "Docs" },
  { name: "MessageSquareQuote", icon: MessageSquareQuote, label: "Copy" },
  { name: "Brush", icon: Brush, label: "Art" },
  { name: "Gem", icon: Gem, label: "Premium" },
  { name: "Heart", icon: Heart, label: "Favorites" },
  { name: "Star", icon: Star, label: "Starred" },
  { name: "Compass", icon: Compass, label: "Explore" },
  { name: "ScanSearch", icon: ScanSearch, label: "Research" },
  { name: "LayoutGrid", icon: LayoutGrid, label: "Layout" },
  { name: "BadgeCheck", icon: BadgeCheck, label: "Approved" },
  { name: "Archive", icon: Archive, label: "Archive" },
  { name: "Sticker", icon: Sticker, label: "Brand" },
  { name: "Swords", icon: Swords, label: "Game" },
  { name: "CircleEllipsis", icon: CircleEllipsis, label: "Misc" },
];

export const DEFAULT_FOLDER_ICON = "FolderKanban";

const folderIconMap = Object.fromEntries(
  FOLDER_ICON_OPTIONS.map((option) => [option.name, option.icon]),
);

export function getFolderIcon(iconName?: string): LucideIcon {
  return folderIconMap[iconName ?? ""] ?? FolderKanban;
}
