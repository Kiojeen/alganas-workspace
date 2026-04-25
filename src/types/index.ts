export interface AiPrompt {
  id: string;
  title: string;
  promptText: string;
  imageUrl?: string;
  model: string;
  folderId: string;
}

export interface PromptFolder {
  id: string;
  name: string;
  icon: string;
}

export interface LinkFolder {
  id: string;
  name: string;
  icon: string;
}

export interface ArchiveLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  folderId: string;
}
