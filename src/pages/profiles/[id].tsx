import { GetServerSidePropsContext, GetStaticPropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import CreatePostModal from '~/components/CreatePostModal';
import InfinitePostList from '~/components/InfinitePostList';
import ProfileCard from '~/components/ProfileCard';
import SuggestedUsersCard from '~/components/SuggestedUsersCard';
import { api } from '~/utils/api';

type ProfilePageProps = {
  id: string;
};

const ProfilePage: NextPage<ProfilePageProps> = ({ id }) => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const closeModal = () => {
    setIsPostModalOpen(false);
  };

  const posts = api.post.infiniteProfileFeed.useInfiniteQuery(
    { userId: id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  return (
    <div className="mt-5 xl:grid xl:grid-cols-3 xl:place-items-center min-h-screen">
      <div className="hidden xl:block self-start w-fit h-fit">
        <ProfileCard userId={id} onAddNewPost={() => setIsPostModalOpen(true)} />
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
      <div className="hidden xl:contents self-start">
        <SuggestedUsersCard />
      </div>
      {isPostModalOpen && <CreatePostModal isOpen={isPostModalOpen} onClose={closeModal} />}
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;

  if (!id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { id },
  };
}

export default ProfilePage;
