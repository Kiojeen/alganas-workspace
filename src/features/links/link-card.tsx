"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, ExternalLink, Link as LinkIcon } from "lucide-react"
import type { ArchiveLink } from "@/types"

interface LinkCardProps {
  linkData: ArchiveLink;
  onEdit: (link: ArchiveLink) => void;
  onDelete: (id: string) => void;
}

export function LinkCard({ linkData, onEdit, onDelete }: LinkCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-md">
            <LinkIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight truncate" title={linkData.title}>
              {linkData.title}
            </h3>
            <a 
              href={linkData.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline flex items-center gap-1 mt-1 truncate"
              title={linkData.url}
            >
              {linkData.url}
              <ExternalLink className="h-3 w-3 inline shrink-0" />
            </a>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 grow">
        {linkData.description ? (
          <p className="text-sm text-muted-foreground line-clamp-4">
            {linkData.description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic opacity-70">
            No description provided.
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 flex justify-end gap-2 border-t mt-auto pt-4">
        <Button variant="ghost" size="sm" onClick={() => onEdit(linkData)}>
          <Edit2 className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(linkData.id)}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}