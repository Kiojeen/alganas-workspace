import { and, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { DEFAULT_FOLDER_ICON } from "@/components/folder-icons";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { schema } from "@/server/db/schema";

const linkFolderInputSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(1).max(120),
  icon: z.string().trim().min(1).max(64).default(DEFAULT_FOLDER_ICON),
});

const linkInputSchema = z.object({
  id: z.uuid().optional(),
  folderId: z.uuid(),
  title: z.string().trim().min(1).max(160),
  url: z.url().trim().max(2048),
  description: z.string().trim().max(2_000).optional(),
});

export const linksRouter = createTRPCRouter({
  getLibrary: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.linkFolders.findMany({
      where: eq(schema.linkFolders.createdById, ctx.session.user.id),
      orderBy: [desc(schema.linkFolders.createdAt)],
      with: {
        links: {
          orderBy: [desc(schema.links.createdAt)],
        },
      },
    });
  }),

  upsertFolder: protectedProcedure
    .input(linkFolderInputSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.id) {
        await ctx.db
          .update(schema.linkFolders)
          .set({
            name: input.name,
            icon: input.icon,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(schema.linkFolders.id, input.id),
              eq(schema.linkFolders.createdById, ctx.session.user.id),
            ),
          );

        return;
      }

      await ctx.db.insert(schema.linkFolders).values({
        name: input.name,
        icon: input.icon,
        createdById: ctx.session.user.id,
      });
    }),

  deleteFolder: protectedProcedure
    .input(z.object({ folderId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(schema.linkFolders)
        .where(
          and(
            eq(schema.linkFolders.id, input.folderId),
            eq(schema.linkFolders.createdById, ctx.session.user.id),
          ),
        );
    }),

  upsertLink: protectedProcedure
    .input(linkInputSchema)
    .mutation(async ({ ctx, input }) => {
      const folder = await ctx.db.query.linkFolders.findFirst({
        where: and(
          eq(schema.linkFolders.id, input.folderId),
          eq(schema.linkFolders.createdById, ctx.session.user.id),
        ),
      });

      if (!folder) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Folder not found" });
      }

      if (input.id) {
        await ctx.db
          .update(schema.links)
          .set({
            folderId: input.folderId,
            title: input.title,
            url: input.url,
            description: input.description,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(schema.links.id, input.id),
              eq(schema.links.createdById, ctx.session.user.id),
            ),
          );

        return;
      }

      await ctx.db.insert(schema.links).values({
        folderId: input.folderId,
        title: input.title,
        url: input.url,
        description: input.description,
        createdById: ctx.session.user.id,
      });
    }),

  deleteLink: protectedProcedure
    .input(z.object({ linkId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(schema.links)
        .where(
          and(
            eq(schema.links.id, input.linkId),
            eq(schema.links.createdById, ctx.session.user.id),
          ),
        );
    }),

  getCounts: protectedProcedure.query(async ({ ctx }) => {
    const [folders, links] = await Promise.all([
      ctx.db.$count(
        schema.linkFolders,
        eq(schema.linkFolders.createdById, ctx.session.user.id),
      ),
      ctx.db.$count(
        schema.links,
        eq(schema.links.createdById, ctx.session.user.id),
      ),
    ]);

    return { folders, links };
  }),
});
