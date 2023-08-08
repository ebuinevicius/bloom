import React from 'react';
import { HandThumbUpIcon } from '@heroicons/react/20/solid';
import { api } from '~/utils/api';
import ButtonTooltip from '../ButtonTooltip';

interface LikeButtonProps {
  post: {
    id: string;
    content: string;
    createdAt: Date;
    likedByMe: boolean;
    _count: {
      likes: number;
    };
    user: {
      name: string | null;
      image: string | null;
    };
  };
  //onLike: (postId: string) => void;
}

function LikeButton({ post }: LikeButtonProps) {
  const trpcUtils = api.useContext();

  const isLiked = post.likedByMe;
  const tooltipText = isLiked ? 'Remove like from post' : 'Like this post';

  const likePost = api.post.likePost.useMutation();
  const handleLike = async () => {
    try {
      await likePost.mutateAsync({ postId: post.id });
      await trpcUtils.post.infiniteFeed.invalidate();
    } catch (error) {
      console.log('Error');
    }
  };
  return (
    <ButtonTooltip tooltip={isLiked ? 'Remove like 💔' : 'Like this post ❤️'}>
      <button
        onClick={handleLike}
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
          {post._count.likes}
        </p>
      </button>
    </ButtonTooltip>
  );
}

export default LikeButton;
