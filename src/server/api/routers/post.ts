import { z } from 'zod';

import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc';

export const postRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({ content: z.string() })).mutation(async ({ input: { content }, ctx }) => {
    const post = await ctx.prisma.post.create({ data: { content, userId: ctx.session.user.id } });
    return post;
  }),

  infiniteProfileFeed: protectedProcedure
    .input(z.object({ limit: z.number().optional(), cursor: z.number().optional(), userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { limit = 5, cursor = 0, userId } = input;

      // Fetch the required posts
      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        skip: cursor,
        where: {
          userId: userId,
        },
        include: {
          user: true,
          _count: {
            select: {
              likes: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc', // Order by the most recent posts
        },
      });

      // Check if each post is liked by the current user.
      const postsWithLikesStatus = await Promise.all(
        posts.map(async (post) => {
          const userLike = await ctx.prisma.like.findUnique({
            where: {
              userId_postId: {
                userId: ctx.session.user.id,
                postId: post.id,
              },
            },
          });

          return {
            ...post,
            likedByMe: !!userLike,
          };
        }),
      );

      // Handle the pagination logic
      const hasMorePosts = postsWithLikesStatus.length > limit;
      if (hasMorePosts) {
        postsWithLikesStatus.pop();
      }

      // Return the processed data.
      return {
        posts: postsWithLikesStatus,
        hasMorePosts,
        nextCursor: hasMorePosts ? cursor + limit : null,
      };
    }),

  infiniteFeed: protectedProcedure
    .input(z.object({ limit: z.number().optional(), cursor: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const { limit = 5, cursor = 0 } = input;
      const currentUserId = ctx.session.user.id;

      // Fetch the required posts
      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        skip: cursor,
        where: {
          OR: [
            {
              user: {
                followers: {
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
          _count: {
            select: {
              likes: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc', // Order by the most recent posts
        },
      });

      // Check if each post is liked by the current user.
      const postsWithLikesStatus = await Promise.all(
        posts.map(async (post) => {
          const userLike = await ctx.prisma.like.findUnique({
            where: {
              userId_postId: {
                userId: currentUserId,
                postId: post.id,
              },
            },
          });

          return {
            ...post,
            likedByMe: !!userLike,
          };
        }),
      );

      // Handle the pagination logic
      const hasMorePosts = postsWithLikesStatus.length > limit;
      if (hasMorePosts) {
        postsWithLikesStatus.pop();
      }

      // Return the processed data.
      return {
        posts: postsWithLikesStatus,
        hasMorePosts,
        nextCursor: hasMorePosts ? cursor + limit : null,
      };
    }),

  likePost: protectedProcedure.input(z.object({ postId: z.string() })).mutation(async ({ input: { postId }, ctx }) => {
    const userId = ctx.session.user.id;

    // Check if the user has already liked this post
    const existingLike = await ctx.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    });

    if (existingLike) {
      // User has already liked, so we'll remove the like
      await ctx.prisma.like.delete({
        where: {
          userId_postId: {
            userId: userId,
            postId: existingLike.postId,
          },
        },
      });
    } else {
      // User hasn't liked, so we'll create a new like
      await ctx.prisma.like.create({
        data: {
          userId: userId,
          postId: postId,
        },
      });
    }
  }),
});
