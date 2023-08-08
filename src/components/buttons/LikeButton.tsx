import React from 'react';
import { HandThumbUpIcon } from '@heroicons/react/20/solid';
import { api } from '~/utils/api';

interface LikeButtonProps {
  post: {
    id: string;
    content: string;
    createdAt: Date;
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
    <button className="w-40 h-40" onClick={handleLike}>
      <HandThumbUpIcon />
    </button>
  );
}

export default LikeButton;
