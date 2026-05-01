import { and, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { DEFAULT_FOLDER_ICON } from "@/components/folder-icons";
import { schema } from "@/server/db/schema";
import { deletePromptImage, savePromptImage } from "@/server/prompt-images";

const promptFolderInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1).max(120),
  icon: z.string().trim().min(1).max(64).default(DEFAULT_FOLDER_ICON),
});

const promptImageUploadSchema = z.object({
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().startsWith("image/").max(100),
  dataBase64: z.string().min(1).max(10_000_000),
});

const promptInputSchema = z.object({
  id: z.uuid().optional(),
  folderId: z.uuid(),
  title: z.string().trim().min(1).max(160),
  promptText: z.string().trim().min(1).max(20_000),
  model: z.string().trim().min(1).max(80),
  imageUpload: promptImageUploadSchema.optional(),
  removeImage: z.boolean().optional(),
});

export const promptsRouter = createTRPCRouter({
  getLibrary: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.promptFolders.findMany({
      where: eq(schema.promptFolders.createdById, ctx.session.user.id),
      orderBy: [desc(schema.promptFolders.createdAt)],
      with: {
        prompts: {
          orderBy: [desc(schema.prompts.createdAt)],
        },
      },
    });
  }),

  upsertFolder: protectedProcedure
    .input(promptFolderInputSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.id) {
        await ctx.db
          .update(schema.promptFolders)
          .set({
            name: input.name,
            icon: input.icon,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(schema.promptFolders.id, input.id),
              eq(schema.promptFolders.createdById, ctx.session.user.id),
            ),
          );

        return;
      }

      await ctx.db.insert(schema.promptFolders).values({
        name: input.name,
        icon: input.icon,
        createdById: ctx.session.user.id,
      });
    }),

  deleteFolder: protectedProcedure
    .input(z.object({ folderId: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const folderPrompts = await ctx.db.query.prompts.findMany({
        where: and(
          eq(schema.prompts.folderId, input.folderId),
          eq(schema.prompts.createdById, ctx.session.user.id),
        ),
        columns: {
          imageUrl: true,
        },
      });

      await Promise.all(
        folderPrompts.map((prompt) => deletePromptImage(prompt.imageUrl)),
      );

      await ctx.db
        .delete(schema.promptFolders)
        .where(
          and(
            eq(schema.promptFolders.id, input.folderId),
            eq(schema.promptFolders.createdById, ctx.session.user.id),
          ),
        );
    }),

  upsertPrompt: protectedProcedure
    .input(promptInputSchema)
    .mutation(async ({ ctx, input }) => {
      const folder = await ctx.db.query.promptFolders.findFirst({
        where: and(
          eq(schema.promptFolders.id, input.folderId),
          eq(schema.promptFolders.createdById, ctx.session.user.id),
        ),
      });

      if (!folder) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Folder not found" });
      }

      if (input.id) {
        const existingPrompt = await ctx.db.query.prompts.findFirst({
          where: and(
            eq(schema.prompts.id, input.id),
            eq(schema.prompts.createdById, ctx.session.user.id),
          ),
        });

        if (!existingPrompt) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Prompt not found",
          });
        }

        let imageUrl = existingPrompt.imageUrl ?? undefined;

        if (input.removeImage) {
          await deletePromptImage(existingPrompt.imageUrl);
          imageUrl = undefined;
        }

        if (input.imageUpload) {
          await deletePromptImage(existingPrompt.imageUrl);
          imageUrl = await savePromptImage({
            ...input.imageUpload,
            userId: ctx.session.user.id,
          });
        }

        await ctx.db
          .update(schema.prompts)
          .set({
            folderId: input.folderId,
            title: input.title,
            promptText: input.promptText,
            model: input.model,
            imageUrl,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(schema.prompts.id, input.id),
              eq(schema.prompts.createdById, ctx.session.user.id),
            ),
          );

        return;
      }

      const imageUrl = input.imageUpload
        ? await savePromptImage({
            ...input.imageUpload,
            userId: ctx.session.user.id,
          })
        : undefined;

      await ctx.db.insert(schema.prompts).values({
        folderId: input.folderId,
        title: input.title,
        promptText: input.promptText,
        model: input.model,
        imageUrl,
        createdById: ctx.session.user.id,
      });
    }),

  deletePrompt: protectedProcedure
    .input(z.object({ promptId: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const prompt = await ctx.db.query.prompts.findFirst({
        where: and(
          eq(schema.prompts.id, input.promptId),
          eq(schema.prompts.createdById, ctx.session.user.id),
        ),
      });

      if (!prompt) {
        return;
      }

      await deletePromptImage(prompt.imageUrl);

      await ctx.db
        .delete(schema.prompts)
        .where(
          and(
            eq(schema.prompts.id, input.promptId),
            eq(schema.prompts.createdById, ctx.session.user.id),
          ),
        );
    }),

  getCounts: publicProcedure.query(async ({ ctx }) => {
    const [folders, prompts] = await Promise.all([
      ctx.db.$count(schema.promptFolders),
      ctx.db.$count(schema.prompts),
    ]);

    return { folders, prompts };
  }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const prompt = await ctx.db.query.prompts.findFirst({
      orderBy: [desc(schema.prompts.createdAt)],
      columns: {
        title: false,
        model: true,
        createdAt: true,
      },
    });

    return prompt ?? null;
  }),
});
