"use client";

import { Check } from "lucide-react";

import {
  FOLDER_ICON_OPTIONS,
  getFolderIcon,
} from "@/components/folder-icons";
import { cn } from "@/lib/utils";

interface FolderIconPickerProps {
  value: string;
  onChange: (value: string) => void;
  title?: string;
  description?: string;
}

export function FolderIconPicker({
  value,
  onChange,
  title = "Folder icon",
  description = "Pick one from the icon library below.",
}: FolderIconPickerProps) {
  const SelectedIcon = getFolderIcon(value);

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-3">
        <div className="bg-primary/12 text-primary flex size-11 items-center justify-center rounded-2xl">
          <SelectedIcon className="size-5" />
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
      </div>

      <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto rounded-2xl border p-2 sm:grid-cols-4 lg:grid-cols-5">
        {FOLDER_ICON_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.name;

          return (
            <button
              key={option.name}
              type="button"
              onClick={() => onChange(option.name)}
              className={cn(
                "group relative flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-center transition-all",
                isSelected
                  ? "border-primary bg-primary/8"
                  : "hover:border-primary/35 hover:bg-muted/40",
              )}
            >
              <span
                className={cn(
                  "bg-muted text-foreground flex size-10 items-center justify-center rounded-xl transition-colors",
                  isSelected && "bg-primary text-primary-foreground",
                )}
              >
                <Icon className="size-4.5" />
              </span>
              <span className="text-xs font-medium">{option.label}</span>
              {isSelected ? (
                <span className="bg-primary text-primary-foreground absolute top-2 right-2 rounded-full p-0.5">
                  <Check className="size-3" />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
