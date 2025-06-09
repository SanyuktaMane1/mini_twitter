import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import PostEditor from "../components/PostEditor";
import PostList from "../components/PostList";
import usePostActions from "../hooks/usePostActions";
import { fetchPosts } from "../services/api";

const Dashboard = ({ user, onLogout }) => {
  const actualUser = user?.user || user;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (err) {
      setError("Failed to load posts.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const { handleCreate, handleUpdate, handleDelete } = usePostActions(
    actualUser,
    loadPosts
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Header actualUser={actualUser} onLogout={onLogout} />
      <div className="pt-20 mb-6">
        <PostEditor onSubmit={(content) => handleCreate(content, setError)} />
      </div>
      <PostList
        posts={posts}
        currentUser={actualUser}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default Dashboard;
