import { z } from 'zod';

import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc';

export const postRouter = createTRPCRouter({
  // Creates a post with the specified content and attaches it to the current user
  create: protectedProcedure.input(z.object({ content: z.string() })).mutation(async ({ input: { content }, ctx }) => {
    const post = await ctx.prisma.post.create({ data: { content, userId: ctx.session.user.id } });
    return post;
  }),

  // Returns an infinite feed of posts from users that the current user is following and their own posts
  infiniteFeed: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      }),
    )
    .query(async ({ ctx, input: { limit = 5, cursor } }) => {
      const currentUserId = ctx.session.user.id;

      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        select: {
          id: true,
          user: {
            select: {
              id: true,
              image: true,
              name: true,
            },
          },
          content: true,
          createdAt: true,
          likes: !currentUserId ? false : { where: { userId: currentUserId } },
          _count: {
            select: {
              likes: true,
            },
          },
        },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
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
      });

      // Handle the pagination logic
      const hasMorePosts = posts.length > limit;
      let nextCursor: typeof cursor | undefined;
      if (hasMorePosts) {
        const nextPost = posts.pop();
        if (nextPost != null) {
          nextCursor = { id: nextPost.id, createdAt: nextPost.createdAt };
        }
      }

      // Return the processed data.
      return {
        posts: posts.map((post) => {
          return {
            id: post.id,
            user: post.user,
            content: post.content,
            createdAt: post.createdAt,
            likedByMe: post.likes.length > 0,
            likeCount: post._count.likes,
          };
        }),
        nextCursor,
      };
    }),

  // Returns an infinite feed of the specified user's posts using a cursor
  infiniteProfileFeed: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
        userId: z.string().optional(),
      }),
    )
    .query(async ({ input: { limit = 5, cursor, userId }, ctx }) => {
      const currentUserId = ctx.session.user.id;

      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        select: {
          id: true,
          user: {
            select: {
              id: true,
              image: true,
              name: true,
            },
          },
          content: true,
          createdAt: true,
          likes: !currentUserId ? false : { where: { userId: currentUserId } },
          _count: {
            select: {
              likes: true,
            },
          },
        },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        where: {
          user: {
            id: userId,
          },
        },
      });

      // Handle the pagination logic
      const hasMorePosts = posts.length > limit;
      let nextCursor: typeof cursor | undefined;
      if (hasMorePosts) {
        const nextPost = posts.pop();
        if (nextPost != null) {
          nextCursor = { id: nextPost.id, createdAt: nextPost.createdAt };
        }
      }

      // Return the processed data.
      return {
        posts: posts.map((post) => {
          return {
            id: post.id,
            user: post.user,
            content: post.content,
            createdAt: post.createdAt,
            likedByMe: post.likes.length > 0,
            likeCount: post._count.likes,
          };
        }),
        nextCursor,
      };
    }),

  // Mutation to like/unlike a post, removing the like from the database if it already exists, otherwise adding it
  likePost: protectedProcedure.input(z.object({ postId: z.string() })).mutation(async ({ input: { postId }, ctx }) => {
    const data = { userId: ctx.session.user.id, postId: postId };

    // Check if the user has already liked this post
    const existingLike = await ctx.prisma.like.findUnique({
      where: {
        userId_postId: data,
      },
    });

    if (existingLike) {
      // User has already liked, so we'll remove the like
      await ctx.prisma.like.delete({
        where: {
          userId_postId: data,
        },
      });
      return { addedLike: false };
    } else {
      // User hasn't liked, so we'll create a new like
      await ctx.prisma.like.create({ data });
      return { addedLike: true };
    }
  }),
});
