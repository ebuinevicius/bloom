import React from 'react';
import { api } from '~/utils/api';
import LikeButton from './buttons/LikeButton';

interface PostCardProps {
  post: {
    id: string;
    content: string;
    createdAt: Date;
    _count: {
      likes: number;
    };
    likedByMe: boolean;
    user: {
      name: string | null;
      image: string | null;
    };
  };
  //onLike: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // Convert the post's createdAt to a "time ago" format
  const timeAgo = new Date().getTime() - new Date(post.createdAt).getTime(); // This gives difference in milliseconds
  const hoursAgo = Math.floor(timeAgo / (1000 * 60 * 60));

  return (
    <div className=" dark:bg-gray-800 p-4 mb-3 w-full rounded shadow-lg border border-gray-200 dark:border-gray-700 space-y-4">
      <div className="flex items-center space-x-2">
        <img src={post.user.image || ''} alt={post.user.name || ''} className="w-10 h-10 rounded-full" />
        <div>
          <h4 className="font-bold">{post.user.name}</h4>
          <p className="text-gray-600">{hoursAgo}h ago</p>
        </div>
      </div>
      <p>{post.content}</p>
      <LikeButton post={post} />
    </div>
  );
};
