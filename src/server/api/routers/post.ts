import { z } from 'zod';

import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc';

export const postRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({ content: z.string() })).mutation(async ({ input: { content }, ctx }) => {
    const post = await ctx.prisma.post.create({ data: { content, userId: ctx.session.user.id } });
    return post;
  }),

  infiniteFeed: protectedProcedure
    .input(z.object({ limit: z.number().optional(), cursor: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const { limit = 10, cursor = 0 } = input;
      const currentUserId = ctx.session.user.id;
      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        skip: cursor,
        where: {
          OR: [
            {
              user: {
                follows: {
                  some: {
                    id: currentUserId,
                  },
                },
              },
            },
            {
              userId: currentUserId,
            },
          ],
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc', // Order by the most recent posts
        },
      });

      const hasMorePosts = posts.length > limit;
      if (hasMorePosts) {
        posts.pop();
      }
      return {
        posts,
        hasMorePosts,
        nextCursor: hasMorePosts ? cursor + limit : null,
      };
    }),
});
