import { createPost, updatePost, deletePost } from "../services/api";

const usePostActions = (user, refresh) => {
  const actualUser = user?.user || user;

  const handleCreate = async (content, setError) => {
    try {
      await createPost({ users_id: actualUser.id, posts_content: content });
      refresh();
    } catch (err) {
      console.error("Create failed", err);
      setError("Failed to create post.");
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await updatePost(id, updatedData);
      refresh();
    } catch (err) {
      alert("Failed to update post", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      refresh();
    } catch (err) {
      alert("Failed to delete post", err);
    }
  };

  return { handleCreate, handleUpdate, handleDelete };
};

export default usePostActions;
