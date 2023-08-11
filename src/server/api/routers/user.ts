import { Input } from 'postcss';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  getUserProfile: protectedProcedure.input(z.object({ userId: z.string() })).query(async ({ ctx, input }) => {
    const { userId } = input;
    const userInfo = await ctx.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        followers: {
          where: {
            id: ctx.session.user.id,
          },
        },
        _count: {
          select: {
            posts: true,
            follows: true,
            followers: true,
          },
        },
      },
    });

    if (userInfo == null) {
      return;
    }

    return {
      ...userInfo,
      isFollowing: userInfo.followers.length > 0,
      postCount: userInfo._count.posts,
      followerCount: userInfo._count.followers,
    };
  }),

  toggleFollow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input: { userId }, ctx }) => {
      const currentUserId = ctx.session.user.id;
      const existingFollow = await ctx.prisma.user.findFirst({
        where: {
          id: currentUserId,
          follows: {
            some: {
              id: userId,
            },
          },
        },
      });

      let addedFollow;
      if (existingFollow == null) {
        await ctx.prisma.user.update({
          where: {
            id: currentUserId,
          },
          data: {
            follows: {
              connect: {
                id: userId,
              },
            },
          },
        });
        addedFollow = true;
      } else {
        await ctx.prisma.user.update({
          where: {
            id: currentUserId,
          },
          data: {
            follows: {
              disconnect: {
                id: userId,
              },
            },
          },
        });
        addedFollow = false;
      }

      return { addedFollow };
    }),

  isFollowing: protectedProcedure
    .input(z.object({ followerId: z.string(), followeeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const isFollowing = await ctx.prisma.user.findUnique({
        where: {
          id: input.followeeId,
        },
        select: {
          followers: {
            where: { id: input.followerId },
          },
        },
      });

      return !!isFollowing?.followers.length;
    }),
});
