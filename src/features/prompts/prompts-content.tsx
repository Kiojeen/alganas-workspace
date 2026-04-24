"use client";

import { useState } from "react";
import { Plus, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { PromptCard } from "./prompt-card";
import { PromptFormDialog } from "./prompt-form-dialog";
import type { AiPrompt } from "@/types";

const MOCK_PROMPTS: AiPrompt[] = [
  {
    id: "1",
    title: "Cinematic Sci-Fi Portrait",
    promptText:
      "Create a highly cinematic and emotionally compelling portrait of a {characterType} set in a futuristic sci-fi universe. The subject is wearing {accessory} with subtle glowing elements, standing in a {environment} filled with atmospheric fog and neon reflections. The lighting should be dramatic and film-like, with strong rim lighting and soft shadows shaping the face. Add intricate surface details such as skin texture, reflections on metallic elements, and depth-of-field blur in the background. The overall color palette should revolve around {primaryColor} and {secondaryColor}, with a strong cyberpunk influence. Composition should feel like a still frame from a high-budget science fiction movie. Ultra-detailed, 8K resolution, photorealistic rendering, cinematic grading.",
    model: "gemini",
    imageUrl:
      "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Minimalist Logo Design",
    promptText:
      "Design a clean and modern minimalist logo featuring a {animal} interacting with a {symbol}. The logo should follow strong visual balance and geometric simplicity, using a limited color palette of {color1} and {color2}. Focus on negative space, symmetry, and scalability so the logo works well across print and digital formats. The design should feel timeless, elegant, and easily recognizable. Use flat vector style, smooth curves, and precise alignment. Avoid unnecessary detail while maintaining a strong visual identity.",
    model: "claude",
    imageUrl:
      "https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Modern Landing Page Copy",
    promptText:
      "Write a complete, modern landing page copy for a {productType} targeted at {targetAudience}. The product helps users achieve {mainBenefit}. Include a compelling hero headline, a concise subheading, and 3–5 key feature sections with short descriptions. Add a persuasive call-to-action that emphasizes urgency and value. Maintain a tone that is {toneStyle}, friendly, and conversion-focused.",
    model: "chatgpt",
  },
  {
    id: "4",
    title: "Fantasy Landscape Artwork",
    promptText:
      "Generate an expansive and visually stunning fantasy landscape featuring {environment}, with large-scale elements like {majorElements}. Include atmospheric depth with distant mountains, layered clouds, and magical lighting effects. Add a small {character} traveling through the scene to give scale and narrative. Use a rich color palette emphasizing {colorTheme}. Ultra-detailed, high fantasy concept art style, dramatic lighting, 4K resolution.",
    model: "gemini",
    imageUrl:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "5",
    title: "Product Description (E-commerce)",
    promptText:
      "Write a high-converting product description for {productName}. Highlight key features such as {feature1}, {feature2}, and {feature3}. Emphasize benefits like comfort, durability, and user experience. Structure it with a strong hook, bullet points, and a persuasive closing call-to-action. Tone should be {toneStyle} and trustworthy.",
    model: "chatgpt",
    imageUrl:
      "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "6",
    title: "Clean Dashboard UI Idea",
    promptText:
      "Describe a modern analytics dashboard UI designed for {userType}. Include charts, filters, tables, and summary cards. Use a {themeMode} theme with clear visual hierarchy. Explain layout, navigation, and interaction design. Focus on usability, clarity, and responsive behavior.",
    model: "claude",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "7",
    title: "Creative Graphic Design Poster",
    promptText:
      "A hyper-creative graphic design poster in collage style, featuring a black and white portrait of a confident man centered in the composition. The background is textured beige paper with a grunge feel. Surrounding the subject are bold blue paint strokes, spray paint typography, and hand-drawn doodles.\n\nLarge graffiti-style text at the top with the name {name} in bold orange brush lettering with paint drips. Include graphic design elements like UI icons (cursor, pen tool, text tool), grids, rulers, anchor points, and vector curves.\n\nAdd creative stickers and shapes like arrows, stars, scribbles, and abstract lines in {accentColors}. Include small text blocks like:\n- {role}\n- {skills}\n- {quote}\n\nUse a mix of clean layout and chaotic artistic elements. High contrast, modern editorial style, inspired by street art and digital design culture. Add a subtle shadow behind the subject with blue paint splash.\n\nLighting: studio portrait lighting, sharp details\nStyle: gritty, urban, creative portfolio poster\nResolution: ultra high detail, 4K, sharp textures",
    model: "gemini",
    imageUrl:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "8",
    title: "Startup Pitch Summary",
    promptText:
      "Summarize a startup idea focused on {industry}. The product uses {technology} to solve {problem}. Clearly explain the value proposition, target market, and uniqueness. Keep it concise, impactful, and investor-ready.",
    model: "chatgpt",
    imageUrl:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "9",
    title: "Story Writing Prompt",
    promptText:
      "Write the opening paragraph of a {genre} story set in {location}. The atmosphere should feel {mood}. Introduce a mysterious event where people begin to {event}, and build tension through vivid imagery and pacing.",
    model: "claude",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "10",
    title: "Futuristic City Render",
    promptText:
      "Create a highly detailed futuristic cityscape set at {timeOfDay}, filled with {vehicles} moving through layered highways and aerial paths. Include neon lights, holographic billboards, reflective wet streets, and massive skyscrapers fading into haze. Use cinematic lighting and volumetric fog. Emphasize {primaryColor} tones. Ultra-detailed, 8K resolution.",
    model: "gemini",
    imageUrl:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop",
  },
];

export function PromptsContent() {
  const [prompts, setPrompts] = useState<AiPrompt[]>(MOCK_PROMPTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<AiPrompt | null>(null);

  const filteredPrompts = prompts.filter(
    (prompt) =>
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.promptText.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddNewPrompt = () => {
    setEditingPrompt(null);
    setIsDialogOpen(true);
  };

  const handleEditPrompt = (prompt: AiPrompt) => {
    setEditingPrompt(prompt);
    setIsDialogOpen(true);
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts((currentPrompts) =>
      currentPrompts.filter((prompt) => prompt.id !== id),
    );
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <InputGroup className="bg-primary-foreground sm:max-w-sm">
          <InputGroupInput
            id="prompt-search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
        <Button onClick={handleAddNewPrompt}>
          <Plus className="mr-2 h-4 w-4" /> Add Prompt
        </Button>
      </div>

      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onEdit={handleEditPrompt}
              onDelete={handleDeletePrompt}
            />
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 rounded-lg border border-dashed py-20 text-center">
          <h3 className="text-lg font-semibold">No prompts found</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Try adjusting your search or add a new prompt.
          </p>
        </div>
      )}

      {isDialogOpen && (
        <PromptFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          initialData={editingPrompt}
        />
      )}
    </>
  );
}
