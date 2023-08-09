import type { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import CreatePostModal from '~/components/CreatePostModal';
import InfinitePostList from '~/components/InfinitePostList';
import ProfileCard from '~/components/ProfileCard';
import { api } from '~/utils/api';

const ProfilePage = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const router = useRouter();
  const { id: profileId } = router.query;

  const closeModal = () => {
    setIsPostModalOpen(false);
  };

  if (!profileId) {
    return;
  }
  if (typeof profileId !== 'string') {
    return <div>Error...</div>;
  }

  const posts = api.post.infiniteProfileFeed.useInfiniteQuery(
    { userId: profileId },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );
  return (
    <div className="mt-5 grid grid-cols-3 place-items-center min-h-screen">
      <div className="text-gray-50 self-start">
        <ProfileCard userId={profileId} onAddNewPost={() => setIsPostModalOpen(true)} />
      </div>
      <div className="grid-col-start-2 grid-col-end-3 flex gap-2 flex-col w-full px-2 self-start">
        <InfinitePostList
          posts={posts.data?.pages.flatMap((page) => page.posts)}
          isError={posts.isError}
          isLoading={posts.isLoading}
          hasMore={posts.hasNextPage}
          fetchNewPosts={posts.fetchNextPage}
        />
      </div>
      {isPostModalOpen && <CreatePostModal isOpen={isPostModalOpen} onClose={closeModal} />}
    </div>
  );
};

export default ProfilePage;
