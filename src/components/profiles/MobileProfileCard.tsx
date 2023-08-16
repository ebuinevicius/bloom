import React from 'react';
import { LoadingSpinner } from '../LoadingSpinner';
import ProfileImage from '../ProfileImage';
import { Button } from '../buttons/Button';
import Link from 'next/link';
import FollowButton from '../buttons/FollowButton';
import { useSession } from 'next-auth/react';
import { api } from '~/utils/api';

interface MobileProfileCardProps {
  onAddNewPost?: () => void;
  userId: string;
}

function MobileProfileCard({ onAddNewPost, userId }: MobileProfileCardProps) {
  const { data: session } = useSession();

  const { data: userProfile, isLoading } = api.user.getUserProfile.useQuery({ userId });

  if (!session?.user?.id || isLoading || !userProfile) {
    return (
      <div className="hidden xl:block self-start w-fit h-fit">
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <div className=" bg-white dark:bg-dark-800 shadow-xl rounded-lg py-3 flex flex-col w-5/6 lg:w-3/5 self-start p-3">
      <div className="flex items-center justify-center gap-10">
        <ProfileImage src={userProfile.image} className="h-20 w-20" />
        <div className="flex flex-col items-end">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-6">{userProfile.name}</h3>
          {session?.user.id === userProfile.id && (
            <h2 className="text-md font-medium text-gray-500 leading-6">{session?.user.email}</h2>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-around text-xl">
        <div className="flex flex-col items-center">
          <p className="text-black dark:text-white">{userProfile?.postCount}</p>
          <p className="text-gray-500">Posts</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-black dark:text-white">{userProfile?.followerCount}</p>
          <p className="text-gray-500">Followers</p>
        </div>
      </div>
      <div className="mt-4 flex justify-around">
        {session?.user.id === userProfile.id ? (
          <>
            <Link href={`/profiles/${session?.user.id}`}>
              <Button gray={true} small className="w-32 text-xl font-bold dark:bg-dark-600">
                Profile
              </Button>
            </Link>
            <Button onClick={onAddNewPost} small className="w-32 text-xl font-bold">
              New Post
            </Button>
          </>
        ) : (
          <FollowButton followerId={session?.user.id} followeeId={userProfile.id} />
        )}
      </div>
    </div>
  );
}

export default MobileProfileCard;
