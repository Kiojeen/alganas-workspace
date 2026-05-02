"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Edit2Icon,
  Trash2Icon,
  ImageIcon,
  CopyIcon,
  CheckIcon,
  ExpandIcon,
} from "lucide-react";
import Image from "next/image";
import type { AiPrompt } from "@/types";
import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { MODELS_LIST } from "@/components/models-list";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PromptCardProps {
  prompt: AiPrompt;
  folderName?: string;
  onEdit: (prompt: AiPrompt) => void;
  onDelete: (id: string) => void;
}

export function PromptCard({
  prompt,
  folderName,
  onEdit,
  onDelete,
}: PromptCardProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const promptParts = useMemo(() => {
    const regex = /\{([^}]+)\}/g;
    const parts: { type: "text" | "variable"; content: string }[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(prompt.promptText)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: prompt.promptText.slice(lastIndex, match.index),
        });
      }
      parts.push({ type: "variable", content: match[1] ?? "" });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < prompt.promptText.length) {
      parts.push({ type: "text", content: prompt.promptText.slice(lastIndex) });
    }

    return parts;
  }, [prompt.promptText]);

  const variableNames = useMemo(
    () =>
      Array.from(
        new Set(
          promptParts
            .filter((part) => part.type === "variable")
            .map((part) => part.content),
        ),
      ),
    [promptParts],
  );

  const [variableValues, setVariableValues] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    setVariableValues((previous) =>
      Object.fromEntries(
        variableNames.map((name) => [name, previous[name] ?? ""]),
      ),
    );
  }, [variableNames]);

  const resolvedPrompt = useMemo(
    () =>
      promptParts
        .map((part) =>
          part.type === "variable"
            ? (variableValues[part.content] ?? `{${part.content}}`)
            : part.content,
        )
        .join(""),
    [promptParts, variableValues],
  );

  const modelsMap = useMemo(
    () =>
      new Map(
        MODELS_LIST.map((model) => [
          model.slug,
          {
            label: model.label,
            icon: model.icon,
          },
        ]),
      ),
    [],
  );

  const modelMeta = modelsMap.get(prompt.model);
  const modelLabel = modelMeta?.label ?? prompt.model.replace("-", " ");
  const placeholderTitle = prompt.title.trim() || "Prompt";
  const placeholderInitials = placeholderTitle
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <>
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md">
      {/* Image Section */}
      <div className="bg-muted relative flex aspect-video w-full items-center justify-center overflow-hidden">
        {prompt.imageUrl ? (
          <button
            type="button"
            className="group relative h-full w-full cursor-zoom-in overflow-hidden text-left"
            onClick={() => setIsImageOpen(true)}
          >
            <Image
              src={prompt.imageUrl}
              height={350}
              width={400}
              alt={prompt.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
            />
            <span className="absolute right-2 bottom-2 flex size-8 items-center justify-center rounded-md bg-background/85 text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
              <ExpandIcon className="size-4" />
              <span className="sr-only">View image</span>
            </span>
          </button>
        ) : (
          <div className="from-muted via-primary/5 to-secondary/50 flex h-full w-full flex-col justify-between bg-linear-to-br p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="bg-background/80 text-primary flex size-11 items-center justify-center rounded-lg border text-sm font-semibold shadow-sm">
                {placeholderInitials || <ImageIcon className="size-5" />}
              </div>
              <Badge variant="secondary" className="max-w-32 truncate">
                {modelLabel}
              </Badge>
            </div>
            <div>
              <p className="text-foreground line-clamp-2 text-lg leading-tight font-semibold">
                {placeholderTitle}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Text prompt preview
              </p>
            </div>
          </div>
        )}
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-lg leading-tight font-semibold">
            {prompt.title}
          </h3>
          <Badge variant="secondary" className="whitespace-nowrap capitalize">
            {modelMeta?.icon} {prompt.model.replace("-", " ")}
          </Badge>
        </div>
        {folderName ? (
          <p className="text-muted-foreground mt-1 truncate text-xs">
            {folderName}
          </p>
        ) : null}
      </CardHeader>

      <CardContent className="grow p-4 pt-2">
        {prompt.description ? (
          <p className="text-muted-foreground mb-3 line-clamp-3 text-sm leading-relaxed">
            {prompt.description}
          </p>
        ) : null}
        <div
          className={cn(
            "bg-muted/50 relative rounded-md border",
            copyError && "border-destructive",
          )}
        >
          <div className="text-muted-foreground min-h-24 p-3 pr-10 text-sm leading-relaxed h-48 overflow-y-auto">
            {promptParts.map((part, i) =>
              part.type === "text" ? (
                <span key={i}>{part.content}</span>
              ) : (
                <Input
                  key={i}
                  type="text"
                  placeholder={part.content}
                  value={variableValues[part.content] ?? ""}
                  onChange={(e) =>
                    setVariableValues((prev) => ({
                      ...prev,
                      [part.content]: e.target.value,
                    }))
                  }
                  className={cn(
                    "mx-0.5 inline-block h-auto min-w-0 rounded border bg-primary-foreground px-1.5 py-0.5 text-sm focus-visible:ring-0",
                    copyError &&
                      !variableValues[part.content] &&
                      "border-destructive bg-destructive/10 placeholder:text-destructive/60",
                  )}
                  style={
                    {
                      width: `${Math.max(
                        part.content.length + 2,
                        (variableValues[part.content]?.length ?? 0) + 1,
                        8,
                      )}ch`,
                      maxWidth: "100%",
                      boxSizing: "border-box",
                    } satisfies CSSProperties
                  }
                />
              ),
            )}
          </div>

          <Button
            variant="secondary"
            size="icon"
            className="absolute top-0 right-0 size-8 rounded-none rounded-tr-md rounded-bl-md border-b border-l shadow-none"
            onClick={async () => {
              const hasEmpty = promptParts
                .filter((p) => p.type === "variable")
                .some((p) => !variableValues[p.content]);

              if (hasEmpty) {
                setCopyError(true);
                setTimeout(() => setCopyError(false), 3000);
                return;
              }

              await navigator.clipboard.writeText(resolvedPrompt);
              setHasCopied(true);
              setTimeout(() => setHasCopied(false), 3000);
            }}
          >
            {hasCopied ? (
              <CheckIcon className="text-emerald-500" />
            ) : (
              <CopyIcon className="text-muted-foreground" />
            )}
            <span className="sr-only">Copy prompt</span>
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2 p-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(prompt)}>
          <Edit2Icon className="mr-1 h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(prompt.id)}
        >
          <Trash2Icon className="mr-1 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
    <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{prompt.title}</DialogTitle>
          {prompt.description ? (
            <DialogDescription>{prompt.description}</DialogDescription>
          ) : null}
        </DialogHeader>
        {prompt.imageUrl ? (
          <div className="bg-muted relative max-h-[75vh] min-h-80 overflow-hidden rounded-lg">
            <Image
              src={prompt.imageUrl}
              alt={prompt.title}
              width={1200}
              height={900}
              className="h-full max-h-[75vh] w-full object-contain"
              priority
            />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
    </>
  );
}
