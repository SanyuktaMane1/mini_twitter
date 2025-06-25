import React, { useEffect, useState, useRef } from "react";
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from "../services/api";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const CommentList = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      const data = await fetchComments(postId);
      setComments(data);
      setError("");
    } catch (err) {
      console.error("Failed to load comments:", err);
      setError(
        "Unable to load comments at the moment. Please try again later."
      );
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const trimmed = newCommentText.trim();

    if (!trimmed) return setError("Comment is required.");
    if (trimmed.length < 2)
      return setError("Comment must be at least 2 characters.");
    if (trimmed.length > 280)
      return setError("Comment must be 280 characters or less.");

    const userId = currentUser?.users_id || currentUser?.id;
    if (!userId) return setError("User ID not found.");

    const payload = {
      posts_id: postId,
      users_id: userId,
      comment_text: trimmed,
    };

    try {
      await createComment(payload);
      setNewCommentText("");
      await loadComments();
      setError("");
    } catch (err) {
      console.error("Error adding comment:", err);
      const backendMsg =
        err.response?.data?.error || "Failed to add comment. Please try again.";
      setError(backendMsg);
    }
  };

  const handleSaveEdit = async (commentId) => {
    const trimmed = editText.trim();

    if (!trimmed) return setError("Comment text cannot be empty.");
    if (trimmed.length < 2)
      return setError("Comment must be at least 2 characters.");
    if (trimmed.length > 280)
      return setError("Comment must be 280 characters or less.");

    try {
      await updateComment(commentId, { comment_text: trimmed });
      setComments((prev) =>
        prev.map((c) =>
          c.comment_id === commentId ? { ...c, comment_text: trimmed } : c
        )
      );
      setEditingCommentId(null);
      setEditText("");
      setError("");
    } catch (err) {
      console.error("Error updating comment:", err);
      setError("Failed to update comment. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.comment_id !== commentId));
      setDropdownOpenId(null);
      setError("");
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError("Failed to delete comment. Please try again.");
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.comment_id);
    setEditText(comment.comment_text);
    setDropdownOpenId(null);
    setError("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mt-3 border-t pt-3">
      <h4 className="font-semibold mb-2">Comments</h4>

      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

      {comments.length === 0 && (
        <p className="text-gray-500 mb-2">No comments yet.</p>
      )}

      {comments.map((comment) =>
        editingCommentId === comment.comment_id ? (
          <div key={comment.comment_id} className="mb-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={() => handleSaveEdit(comment.comment_id)}
              className="mr-2 bg-green-600 text-white px-2 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditingCommentId(null)}
              className="bg-gray-400 text-white px-2 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div key={comment.comment_id} className="mb-2 border-b pb-2 relative">
            <p>{comment.comment_text}</p>
            <p className="text-sm text-gray-500">
              Posted by {comment.User?.usersname || `User #${comment.users_id}`}
              •{" "}
              {new Date(comment.created_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </p>

            {comment.users_id === (currentUser.users_id || currentUser.id) && (
              <div className="absolute right-0 top-0" ref={dropdownRef}>
                <button
                  onClick={() =>
                    setDropdownOpenId((prev) =>
                      prev === comment.comment_id ? null : comment.comment_id
                    )
                  }
                  className="p-1 hover:bg-gray-200 rounded"
                  data-tooltip-id="shared-tooltip"
                  data-tooltip-content="More options"
                >
                  <MoreVertical size={18} />
                </button>

                {dropdownOpenId === comment.comment_id && (
                  <div className="absolute right-0 mt-2 w-28 bg-white border shadow-md rounded z-10">
                    <button
                      onClick={() => handleEditComment(comment)}
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                      data-tooltip-id="shared-tooltip"
                      data-tooltip-content="Edit Comment"
                    >
                      <Pencil size={16} className="mr-2" /> Edit
                    </button>

                    <button
                      onClick={() => handleDeleteComment(comment.comment_id)}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                      data-tooltip-id="shared-tooltip"
                      data-tooltip-content="Delete Comment"
                    >
                      <Trash2 size={16} className="mr-2" /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      )}

      <form onSubmit={handleAddComment} className="mt-4">
        <textarea
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Add a comment..."
          rows={2}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Comment
        </button>
      </form>
      <Tooltip id="shared-tooltip" />
    </div>
  );
};

export default CommentList;
