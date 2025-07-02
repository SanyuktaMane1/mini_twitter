import axios from "axios";

// const API_BASE = "/api/v1";
const API_BASE = "http://52.204.186.98:5000/api/v1"; 


export const fetchPosts = async (userId) => {
  const res = await axios.get(`${API_BASE}/posts`, { userId });
  return res.data;
};

export const createPost = async (postData) => {
  try {
    const response = await axios.post(
      "http://52.204.186.98:5000/api/v1/posts",
      postData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data);
    console.error("Create post error:", error);
    throw new Error(error.response?.data?.error || "Failed to create post");
  }
};

export const updatePost = async (postId, postData) => {
  const response = await axios.put(`${API_BASE}/posts/${postId}`, postData);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await axios.delete(`${API_BASE}/posts/${postId}`);
  return response.data;
};

// Comments API
export const fetchComments = async (postId) => {
  const res = await axios.get(`${API_BASE}/comments/posts/${postId}`);
  return res.data;
};

export const createComment = async (commentData) => {
  const res = await axios.post(`${API_BASE}/comments`, commentData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const updateComment = async (commentId, commentData) => {
  const res = await axios.put(
    `${API_BASE}/comments/${commentId}`,
    commentData,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data;
};

export const deleteComment = async (commentId) => {
  const res = await axios.delete(`${API_BASE}/comments/${commentId}`);
  return res.data;
};
export const likePost = async ({ users_id, posts_id }) => {
  const res = await axios.post(`${API_BASE}/likes`, { users_id, posts_id });
  return res.data;
};

export const unlikePost = async ({ users_id, posts_id }) => {
  const res = await axios.delete(`${API_BASE}/likes`, {
    data: { users_id, posts_id },
  });
  return res.data;
};
