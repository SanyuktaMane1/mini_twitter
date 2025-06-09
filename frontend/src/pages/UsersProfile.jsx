import React, { useEffect, useState } from "react";
import { fetchPosts } from "../services/api";
import { useNavigate } from "react-router-dom";
import PostEditor from "../components/PostEditor";
import PostList from "../components/PostList";
import usePostActions from "../hooks/usePostActions";
import Header from "../components/Header";
const UserProfile = ({ user, onLogout }) => {
  const actualUser = user?.user || user;
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadUserPosts = async () => {
    setLoading(true);
    try {
      const allPosts = await fetchPosts();
      const filtered = allPosts.filter((p) => p.users_id === actualUser.id);
      setUserPosts(filtered);
    } catch (err) {
      setError("Error loading user posts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserPosts();
  }, []);

  const { handleCreate, handleUpdate, handleDelete } = usePostActions(
    actualUser,
    loadUserPosts
  );

  return (
    <div className="max-w-3xl mx-auto mt-20 p-4">
      <Header actualUser={actualUser} onLogout={onLogout} />
      <button
        onClick={() => navigate("/")}
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
      >
        ← Back to Home
      </button>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          {actualUser.usersname || actualUser.username}'s Profile
        </h2>
        <span className="text-gray-500 font-medium">
          Posts: {userPosts.length}
        </span>
      </div>

      <PostEditor onSubmit={(content) => handleCreate(content, setError)} />

      <PostList
        posts={userPosts}
        currentUser={actualUser}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default UserProfile;
