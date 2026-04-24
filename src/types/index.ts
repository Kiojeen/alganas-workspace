export interface AiPrompt {
  id: string;
  title: string;
  promptText: string;
  imageUrl?: string;
  model: string;
}

export interface ArchiveLink {
  id: string;
  title: string;
  url: string;
  description?: string;
}