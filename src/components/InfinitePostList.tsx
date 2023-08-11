import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LoadingSpinner } from './LoadingSpinner';
import Link from 'next/link';
import { api } from '~/utils/api';
import { HandThumbUpIcon } from '@heroicons/react/20/solid';
import ButtonTooltip from './ButtonTooltip';

type Post = {
  id: string;
  content: string;
  createdAt: Date;
  user: { id: string; image: string | null; name: string | null };
  likeCount: number;
  likedByMe: boolean;
};

type InfinitePostListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewPosts: () => Promise<unknown>;
  posts?: Post[];
};

export default function InfinitePostList({
  posts,
  isError,
  isLoading,
  fetchNewPosts,
  hasMore = false,
}: InfinitePostListProps) {
  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <h1 className="self-center text-xl pt-5">Error...</h1>;
  }
  if (posts == null || posts.length == 0) {
    return <h1 className="self-center text-xl pt-5">Nothing to display</h1>;
  }

  return (
    <ul>
      <InfiniteScroll
        style={{ overflow: 'visible' }}
        dataLength={posts.length}
        next={fetchNewPosts}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
      >
        {posts.map((post) => {
          return <PostCard key={post.id} {...post} />;
        })}
      </InfiniteScroll>
    </ul>
  );
}

function PostCard({ id, content, createdAt, likeCount, likedByMe, user }: Post) {
  // Convert the post's createdAt to a "time ago" format
  const timeAgo = new Date().getTime() - new Date(createdAt).getTime(); // This gives difference in milliseconds
  const hoursAgo = Math.floor(timeAgo / (1000 * 60 * 60));
  const trpcUtils = api.useContext();

  const likePost = api.post.likePost.useMutation({
    onSuccess: async ({ addedLike }) => {
      const likeModifier = addedLike ? 1 : -1;

      const updateFeed: Parameters<typeof trpcUtils.post.infiniteFeed.setInfiniteData>[1] = (oldData) => {
        if (oldData == null) {
          return;
        }

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              posts: page.posts.map((post) => {
                if (post.id === id) {
                  return {
                    ...post,
                    likeCount: post.likeCount + likeModifier,
                    likedByMe: addedLike,
                  };
                }

                return post;
              }),
            };
          }),
        };
      };

      const updateProfile: Parameters<typeof trpcUtils.user.getUserProfile.setData>[1] = (oldData) => {
        if (oldData == null) {
          return;
        }

        return {
          ...oldData,
          postCount: oldData.postCount + 1,
        };
      };

      // Update feeds to have the new post and
      trpcUtils.post.infiniteFeed.setInfiniteData({}, updateFeed);
      trpcUtils.post.infiniteProfileFeed.setInfiniteData({ userId: user.id }, updateFeed);
      trpcUtils.user.getUserProfile.setData({}, updateProfile);
    },
  });

  const handleLike = () => {
    likePost.mutate({ postId: id });
  };

  return (
    <div className=" dark:bg-gray-800 p-4 mb-3 w-full rounded shadow-lg border border-gray-200 dark:border-gray-700 space-y-2">
      <Link className="flex gap-2 items-center" href={`/profiles/${user.id}`}>
        <img src={user.image || ''} alt={user.name || ''} className="w-10 h-10 rounded-full" />
        <div>
          <h4 className="font-bold">{user.name}</h4>
        </div>
      </Link>
      <p className="text-gray-600">{hoursAgo}h ago</p>
      <p className="text-lg font-normal">{content}</p>
      <LikeButton isLiked={likedByMe} isLoading={likePost.isLoading} likeCount={likeCount} onClick={handleLike} />
    </div>
  );
}

type LikeButtonProps = {
  isLoading: boolean;
  isLiked: boolean;
  likeCount: number;
  onClick: () => void;
};

function LikeButton({ isLiked, isLoading, likeCount, onClick }: LikeButtonProps) {
  const trpcUtils = api.useContext();

  return (
    <ButtonTooltip tooltip={isLiked ? 'Remove like 💔' : 'Like this post ❤️'}>
      <button
        onClick={onClick}
        className={`flex  gap-2 rounded-md ${
          isLiked
            ? 'bg-green-600 dark:bg-green-300 hover:bg-green-700 dark:hover:bg-green-400'
            : 'bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600'
        } py-1 px-2`}
      >
        <HandThumbUpIcon
          className={`h-6 w-6 ${isLiked ? 'text-white dark:text-black' : 'text-black dark:text-white'}`}
        />
        <p className={`${isLiked ? 'text-white dark:text-black' : 'text-black dark:text-white'} font-semibold`}>
          {likeCount}
        </p>
      </button>
    </ButtonTooltip>
  );
}
