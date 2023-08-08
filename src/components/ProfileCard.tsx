import React from 'react';
import ProfileImage from './ProfileImage';
import { useSession } from 'next-auth/react';
import { Button } from './buttons/Button';
import { api } from '~/utils/api';
import { LoadingSpinner } from './LoadingSpinner';

interface ProfileCardProps {
  onAddNewPost: () => void;
}

function ProfileCard({ onAddNewPost }: ProfileCardProps) {
  const { data: session } = useSession();

  if (!session?.user?.id) {
    return <LoadingSpinner />;
  }

  const userProfile = api.user.getUserProfile.useQuery(session.user.id);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg py-3 flex flex-col items-center px-3 justify-center h-full w-full">
      <ProfileImage src={session?.user.image} className="h-20 w-20" />
      <div className="p-2 flex items-center flex-col gap-5">
        <h3 className="text-center text-2xl font-bold text-gray-900 dark:text-white leading-8">{session?.user.name}</h3>
        <h2 className="text-center text-lg font-bold text-gray-500 leading-8">{session?.user.email}</h2>
        <div className="flex gap-6 justify-around text-xl">
          <div className="flex flex-col items-center">
            {userProfile.isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <p className="text-black dark:text-white">{userProfile.data?._count.posts}</p>
                <p className="text-gray-500">Posts</p>
              </>
            )}
          </div>
          <div className="flex flex-col items-center">
            {userProfile.isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <p className="text-black dark:text-white">{userProfile.data?._count.followers}</p>
                <p className="text-gray-500">Followers</p>
              </>
            )}
          </div>
        </div>
        <Button gray={true} small={true} className="w-36 text-xl font-bold">
          Profile
        </Button>
        <Button onClick={onAddNewPost} small={true} className="w-36 text-xl font-bold">
          New Post
        </Button>
      </div>
    </div>
  );
}

export default ProfileCard;
