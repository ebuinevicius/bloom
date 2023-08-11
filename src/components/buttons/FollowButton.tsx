import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import { LoadingSpinner } from '../LoadingSpinner';

// interface FollowButtonProps {
//   followerId: string; // Logged-in user's ID
//   followeeId: string; // Profile user's ID
// }

// const FollowButton: React.FC<FollowButtonProps> = ({ followerId, followeeId }: FollowButtonProps) => {
//   const { data: isFollowing, isLoading } = api.user.isFollowing.useQuery({ followerId, followeeId });
//   const trpcUtils = api.useContext();

//   // Call toggleFollow mutation to update the user's follower count for display on profile
//   const toggleFollow = api.user.toggleFollow.useMutation({
//     onSuccess: async (result) => {
//       // Update profile of user who was followed to display new follower count
//       const updateFollowee: Parameters<typeof trpcUtils.user.getUserProfile.setData>[1] = (oldData) => {
//         if (oldData == null) {
//           return;
//         }
//         let followerCountModifier = oldData.isFollowing
//         if (oldData.isFollowing) {

//         }

//         return {
//           ...oldData,
//           followerCount: oldData.followerCount + 1,
//         };
//       };

//       // Update the isFollowing status for the user who followed
//       const updateFollower: Parameters<typeof trpcUtils.user.isFollowing.setData>[1] = (wasFollowing) => {
//         if (wasFollowing == null) {
//           return;
//         }

//         return !wasFollowing;
//       };

//       trpcUtils.user.getUserProfile.setData({ userId: followerId }, updateFollowee);
//       trpcUtils.user.isFollowing.setData({ followerId: followerId, followeeId: followeeId }, updateFollower);
//     },
//   });

//   const handleFollowToggle = async () => {
//     toggleFollow.mutate({ userId: followeeId });
//   };

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <button
//       className={`rounded py-2 px-3 w-4/6 font-semibold text-xl text-black ${
//         isFollowing ? 'bg-red-500' : 'bg-green-400'
//       }`}
//       onClick={handleFollowToggle}
//     >
//       {isFollowing ? 'Unfollow' : 'Follow'}
//     </button>
//   );
// };

export default FollowButton;
