import { Input } from 'postcss';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure, protectedProcedure } from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  getUserProfile: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const userId = input;
    const userWithPostCount = await ctx.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        _count: {
          select: {
            posts: true,
            follows: true,
            followers: true,
          },
        },
      },
    });
    return userWithPostCount;
  }),
});
