import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DEFAULT_FOLDER_ICON } from "@/components/folder-icons";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

import { schema } from "@/server/db/schema";
import { s3 } from "@/server/storage";
import { randomUUID } from "crypto";
import { env } from "@/env";

const promptFolderInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1).max(120),
  icon: z.string().trim().min(1).max(64).default(DEFAULT_FOLDER_ICON),
});

const promptImageUploadSchema = z.object({
  publicUrl: z.url(),
});

const promptInputSchema = z.object({
  id: z.uuid().optional(),
  folderId: z.uuid(),
  title: z.string().trim().min(1).max(160),
  description: z
    .string()
    .trim()
    .max(2000, { message: "Description must be 2000 characters or less." })
    .optional()
    .or(z.literal("")),
  promptText: z.string().trim().min(1).max(20_000),
  model: z.string().trim().min(1).max(80),
  imageUpload: promptImageUploadSchema.optional(),
  removeImage: z.boolean().optional(),
});

import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export const deletePromptImage = async (imageUrl?: string | null) => {
  if (!imageUrl) return;

  try {
    // Extract key from public URL
    const url = new URL(imageUrl);

    // Example:
    // https://cdn.domain.com/prompts/abc.png
    // → prompts/abc.png
    const key = url.pathname.startsWith("/")
      ? url.pathname.slice(1)
      : url.pathname;

    if (!key) return;

    await s3.send(
      new DeleteObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
      }),
    );
  } catch (err) {
    console.error("Failed to delete image from R2:", err);
  }
};

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
          imageUrl = input.imageUpload.publicUrl;
        }

        await ctx.db
          .update(schema.prompts)
          .set({
            folderId: input.folderId,
            title: input.title,
            description: input.description?.trim() || null,
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

      const imageUrl = input.imageUpload?.publicUrl;

      await ctx.db.insert(schema.prompts).values({
        folderId: input.folderId,
        title: input.title,
        description: input.description?.trim() || null,
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

  getImageUploadUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        mimeType: z.string().regex(/^image\//),
      }),
    )
    .mutation(async ({ input }) => {
      const key = `prompts/${randomUUID()}-${input.fileName}`;

      const signedUrl = await getSignedUrl(
        s3,
        new PutObjectCommand({
          Bucket: env.R2_BUCKET_NAME,
          Key: key,
          ContentType: input.mimeType,
        }), // 60 mins = 1 hour
        { expiresIn: 60 * 60  },
      );

      return {
        signedUrl,
        publicUrl: `${env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`
      };
    }),
});
