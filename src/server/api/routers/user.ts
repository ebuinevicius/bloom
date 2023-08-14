import { Input } from 'postcss';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  // Retrieves the profile information for a certain user by id for display on profile cards and profile pages
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

  // Mutation for following a user, updating each users follows or followers and returning whether a follow was added
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

  // Query to check whether one user is following another
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

  getPopularUsers: protectedProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.session.user.id;

    const popularUsers = await ctx.prisma.user.findMany({
      take: 5,
      where: {
        NOT: {
          id: currentUserId,
        },
      },
      orderBy: [
        {
          followers: {
            _count: 'desc',
          },
        },
        {
          id: 'desc',
        },
      ],
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    return popularUsers;
  }),
});
