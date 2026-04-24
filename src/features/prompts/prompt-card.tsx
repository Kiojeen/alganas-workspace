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
} from "lucide-react";
import Image from "next/image";
import type { AiPrompt } from "@/types";
import { useMemo, useState } from "react";
import { MODELS_LIST } from "../../components/models-list";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PromptCardProps {
  prompt: AiPrompt;
  onEdit: (prompt: AiPrompt) => void;
  onDelete: (id: string) => void;
}

export function PromptCard({ prompt, onEdit, onDelete }: PromptCardProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
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

  const [variableValues, setVariableValues] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        (prompt.promptText.match(/\{([^}]+)\}/g) ?? []).map((m) => [
          m.slice(1, -1),
          "",
        ]),
      ),
  );

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

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md">
      {/* Image Section */}
      <div className="bg-muted relative flex aspect-video w-full items-center justify-center overflow-hidden">
        {prompt.imageUrl ? (
          <Image
            src={prompt.imageUrl}
            height={350}
            width={400}
            alt={prompt.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground flex flex-col items-center">
            <ImageIcon className="mb-2 h-8 w-8 opacity-50" />
            <span className="text-xs">No image uploaded</span>
          </div>
        )}
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-lg leading-tight font-semibold">
            {prompt.title}
          </h3>
          <Badge variant="secondary" className="whitespace-nowrap capitalize">
            {modelsMap.get(prompt.model)?.icon} {prompt.model.replace("-", " ")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="grow p-4 pt-2">
        <div
          className={cn(
            "bg-muted/50 relative rounded-md border",
            copyError && "border-destructive",
          )}
        >
          <div className="text-muted-foreground min-h-24 p-3 pr-10 text-sm leading-relaxed">
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
                    "mx-0.5 bg-primary-foreground focus-visible:ring-0 inline-block h-auto w-(--input-w) rounded border px-1.5 py-0.5 text-sm",
                    copyError &&
                      !variableValues[part.content] &&
                      "border-destructive bg-destructive/10 placeholder:text-destructive/60",
                  )}
                  style={
                    {
                      "--input-w": `${Math.max(
                        part.content.length + 1,
                        variableValues[part.content]?.length ?? 0,
                      )}ch`,
                      maxWidth: "100%",
                    } as React.CSSProperties
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

      <CardFooter className="flex justify-end gap-2">
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
  );
}
