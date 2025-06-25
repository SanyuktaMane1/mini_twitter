import React, { useEffect, useState } from "react";
import { fetchPosts } from "../services/api";
import { useNavigate } from "react-router-dom";
import PostEditor from "../components/PostEditor";
import PostList from "../components/PostList";
import usePostActions from "../hooks/usePostActions";
import Header from "../components/Header";
import { motion as Motion } from "framer-motion";

const UserProfile = ({ user, onLogout }) => {
  const actualUser = user;
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
    <Motion.div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(90deg, rgba(140, 222, 255, 1) 0%, rgba(200, 244, 250, 1) 50%, rgba(31, 204, 152, 1) 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Header actualUser={actualUser} onLogout={onLogout} />

        <button
          onClick={() => navigate("/")}
          className="mb-4 mt-10 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
        >
          ← Back to Home
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">
            {actualUser.usersname || actualUser.username}'s Profile
          </h1>
          <span className="text-gray-700 font-medium">
            Posts: {userPosts.length}
          </span>
        </div>

        <Motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <PostEditor onSubmit={(content) => handleCreate(content, setError)} />
        </Motion.div>

        <PostList
          posts={userPosts}
          currentUser={actualUser}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          loading={loading}
          error={error}
        />
      </div>
    </Motion.div>
  );
};

export default UserProfile;
