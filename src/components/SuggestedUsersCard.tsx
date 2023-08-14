import React from 'react';
import { api } from '~/utils/api';
import FollowButton from './buttons/FollowButton';
import { useSession } from 'next-auth/react';
import ProfileImage from './ProfileImage';
import Link from 'next/link';
import { LoadingSpinner } from './LoadingSpinner';

function SuggestedUsersCard() {
  const { data: session } = useSession();
  const { data: userList, isLoading, isError, error } = api.user.getPopularUsers.useQuery();
  if (isLoading)
    return (
      <div className="self-start">
        <LoadingSpinner />
      </div>
    );
  if (isError || !session || !userList) return <div>Error...</div>;

  return (
    <div className="hidden bg-white dark:bg-dark-800 gap-6 shadow-xl rounded-lg py-6 xl:flex xl:flex-col items-center px-3 self-start w-5/6">
      <h3 className="card-header font-bold text-xl">Popular Users</h3>
      <ul className="flex flex-col gap-6 w-4/5">
        {userList.map((user) => (
          <li key={user.id} className="flex flex-row items-center gap-2 justify-between">
            <Link className="flex flex-row items-center gap-2" href={`/profiles/${user.id}`}>
              <ProfileImage src={`${user.image}`} className="h-12 w-12 rounded-full" />
              <span className="font-semibold">{user.name}</span>
            </Link>
            <FollowButton followerId={session?.user.id} followeeId={user.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SuggestedUsersCard;
