import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import Header from "../components/Header";
import PostEditor from "../components/PostEditor";
import PostList from "../components/PostList";
import usePostActions from "../hooks/usePostActions";
import { fetchPosts } from "../services/api";

const Dashboard = ({ user, onLogout }) => {
  const actualUser = user;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPosts = async () => {
    setLoading(true);
    try {
      console.log("Heree");
      const data = await fetchPosts(actualUser.id);
      console.log(data);
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

        <h1 className="text-2xl font-semibold text-blue-800 mt-8 mb-4">
          Welcome, {actualUser?.usersname || actualUser?.username || "User"}!
        </h1>

        <Motion.div
          className="mt-8 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <PostEditor
            onSubmit={(content) => handleCreate(content, setError)}
            className="shadow-lg"
          />
        </Motion.div>

        <div className="space-y-6">
          <PostList
            posts={posts}
            currentUser={actualUser}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </Motion.div>
  );
};

export default Dashboard;
