import PostCard from "./PostCard";

const PostList = ({
  posts,
  currentUser,
  onUpdate,
  onDelete,
  loading,
  error,
}) => {
  return (
    <>
      {loading && <p>Loading posts...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && posts.length === 0 && <p>No posts yet.</p>}
      {posts.map((post) => (
        <PostCard
          key={post.posts_id}
          post={post}
          currentUser={currentUser}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </>
  );
};

export default PostList;
