import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import { LoadingSpinner } from '../LoadingSpinner';

interface FollowButtonProps {
  followerId: string; // Logged-in user's ID
  followeeId: string; // Profile user's ID
}

const FollowButton: React.FC<FollowButtonProps> = ({ followerId, followeeId }: FollowButtonProps) => {
  const { data: isFollowing, isLoading } = api.user.isFollowing.useQuery({ followerId, followeeId });
  const trpcUtils = api.useContext();

  const toggleFollow = api.user.toggleFollow.useMutation({
    onSuccess: async (result) => {
      console.log(result);
      await trpcUtils.user.isFollowing.invalidate();
      await trpcUtils.user.getUserProfile.invalidate();
    },
  });

  const handleFollowToggle = async () => {
    toggleFollow.mutate({ userId: followeeId });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <button
      className={`rounded py-2 px-3 w-4/6 font-semibold text-xl text-black ${
        isFollowing ? 'bg-red-500' : 'bg-green-400'
      }`}
      onClick={handleFollowToggle}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
