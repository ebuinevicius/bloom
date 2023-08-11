import React from 'react';
import ProfileImage from './ProfileImage';
import { useSession } from 'next-auth/react';
import { Button } from './buttons/Button';
import { api } from '~/utils/api';
import { LoadingSpinner } from './LoadingSpinner';
import Link from 'next/link';
import FollowButton from './buttons/FollowButton';

interface ProfileCardProps {
  onAddNewPost?: () => void;
  userId: string;
}

function ProfileCard({ onAddNewPost, userId }: ProfileCardProps) {
  const { data: session } = useSession();

  const { data: userProfile, isLoading } = api.user.getUserProfile.useQuery({ userId });

  if (!session?.user?.id || isLoading || !userProfile) {
    return <LoadingSpinner />;
  }
  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg py-3 flex flex-col items-center px-3 justify-center h-full w-full">
      <ProfileImage src={userProfile.image} className="h-20 w-20" />
      <div className="p-2 flex items-center flex-col gap-5">
        <h3 className="text-center text-2xl font-bold text-gray-900 dark:text-white leading-8">{userProfile.name}</h3>
        {session?.user.id === userProfile.id ? (
          <h2 className="text-center text-lg font-bold text-gray-500 leading-8">{session?.user.email}</h2>
        ) : (
          <></>
        )}
        <div className="flex gap-6 justify-around text-xl">
          <div className="flex flex-col items-center">
            <p className="text-black dark:text-white">{userProfile?.postCount}</p>
            <p className="text-gray-500">Posts</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-black dark:text-white">{userProfile?.followerCount}</p>
            <p className="text-gray-500">Followers</p>
          </div>
        </div>
        {session?.user.id === userProfile.id ? (
          <>
            <Link href={`/profiles/${session?.user.id}`}>
              <Button gray={true} small={true} className="w-36 text-xl font-bold">
                Profile
              </Button>
            </Link>

            <Button onClick={onAddNewPost} small={true} className="w-36 text-xl font-bold">
              New Post
            </Button>
          </>
        ) : (
          <div className="w-5/6  flex items-center justify-center text-2xl">
            <FollowButton followerId={session?.user.id} followeeId={userProfile.id} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;
