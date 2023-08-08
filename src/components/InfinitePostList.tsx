import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LoadingSpinner } from './LoadingSpinner';
import { PostCard } from './PostCard';

type Post = {
  id: string;
  content: string;
  createdAt: Date;
  user: { id: string; image: string | null; name: string | null };
  _count: {
    likes: number;
  };
  likedByMe: boolean;
};

type InfinitePostListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewPosts: () => Promise<unknown>;
  posts?: Post[];
};

function InfinitePostList({ posts, isError, isLoading, fetchNewPosts, hasMore = false }: InfinitePostListProps) {
  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <h1 className="self-center text-xl pt-5">Error...</h1>;
  }
  if (posts == null || posts.length == 0) {
    return <h1 className="self-center text-xl pt-5">Nothing to display</h1>;
  }
  return (
    <ul>
      <InfiniteScroll
        style={{ overflow: 'visible' }}
        dataLength={posts.length}
        next={fetchNewPosts}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
      >
        {posts.map((post) => {
          return <PostCard key={post.id} post={post} />;
        })}
      </InfiniteScroll>
    </ul>
  );
}

export default InfinitePostList;
