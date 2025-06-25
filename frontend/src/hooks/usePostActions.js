import { createPost, updatePost, deletePost } from "../services/api";


const usePostActions = (user, refresh) => {
  const actualUser = user?.user || user;

  const handleCreate = async (content, setError) => {
    const trimmed = content.trim();

    if (!trimmed) {
      setError("Post content is required.");
      return;
    }
    if (trimmed.length < 2) {
      setError("Post must be at least 2 characters.");
      return;
    }
    if (trimmed.length > 280) {
      setError("Post must be 280 characters or less.");
      return;
    }

    try {
      await createPost({ users_id: actualUser.id, posts_content: trimmed });

      setError("");
    } catch (err) {
      console.error("Create failed", err);
      const backendMessage =
        err.response?.data?.error || "Failed to create post.";
      setError(backendMessage);
    }
    console.log("Here 1st");
    refresh();
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await updatePost(id, updatedData);
      refresh();
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update post.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      refresh();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete post.");
    }
  };

  return { handleCreate, handleUpdate, handleDelete };
};

export default usePostActions;
