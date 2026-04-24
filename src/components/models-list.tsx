import { ClaudeAiIcon } from "./ui/svgs/claudeAiIcon";
import { Gemini } from "./ui/svgs/gemini";
import { Openai } from "./ui/svgs/openai";

type ModelsList = {
  slug: string;
  label: string;
  icon: React.ReactNode;
};

export const MODELS_LIST: ModelsList[] = [
  {
    slug: "gemini",
    label: "Gemini",
    icon: <Gemini />,
  },
  {
    slug: "chatgpt",
    label: "ChatGPT",
    icon: <Openai />,
  },
  {
    slug: "claude",
    label: "Claude",
    icon: <ClaudeAiIcon />,
  },
];
