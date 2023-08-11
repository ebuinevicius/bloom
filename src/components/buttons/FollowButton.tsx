import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import { LoadingSpinner } from '../LoadingSpinner';

interface FollowButtonProps {
  followerId: string; // Logged-in user's ID
  followeeId: string; // Profile user's ID
}

const FollowButton: React.FC<FollowButtonProps> = ({ followerId, followeeId }: FollowButtonProps) => {
  // TODO add variants based on size for styling

  const { data: isFollowing, isLoading } = api.user.isFollowing.useQuery({ followerId, followeeId });
  const trpcUtils = api.useContext();

  // Call toggleFollow mutation to update the user's follower count for display on profile
  const toggleFollow = api.user.toggleFollow.useMutation({
    onSuccess: async (result) => {
      // Update profile of user who was followed to display new follower count
      const updateFollowee: Parameters<typeof trpcUtils.user.getUserProfile.setData>[1] = (oldData) => {
        if (oldData == null) {
          return;
        }
        let followerCountModifier = oldData.isFollowing;
        if (oldData.isFollowing) {
        }

        return {
          ...oldData,
          followerCount: oldData.followerCount + 1,
        };
      };

      // Update the isFollowing status for the user who followed
      const updateFollower: Parameters<typeof trpcUtils.user.isFollowing.setData>[1] = (wasFollowing) => {
        if (wasFollowing == null) {
          return;
        }

        return !wasFollowing;
      };

      trpcUtils.user.getUserProfile.setData({ userId: followerId }, updateFollowee);
      trpcUtils.user.isFollowing.setData({ followerId: followerId, followeeId: followeeId }, updateFollower);
    },
  });

  const handleFollowToggle = async () => {
    await toggleFollow.mutate({ userId: followeeId });
  };

  // If initial toggle state is loading return spinner
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <button
      disabled={toggleFollow.isLoading}
      className={`rounded py-2 px-3 w-full font-semibold autofit flex items-center justify-center overflow-hidden ${
        isFollowing ? 'bg-red-500' : 'bg-violet-400 text-black dark:bg-violet-600 dark:text-white'
      }`}
      onClick={handleFollowToggle}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
