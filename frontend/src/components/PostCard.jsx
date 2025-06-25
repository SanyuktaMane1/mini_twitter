import React, { useState, useEffect, useRef } from "react";
import CommentList from "./CommentList";
import {
  Pencil,
  Trash2,
  Heart,
  MessageCircle,
  MoreVertical,
} from "lucide-react";
import { motion as Motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import PostEditor from "../components/PostEditor";
import { likePost, unlikePost } from "../services/api";

const PostCard = ({ post, currentUser, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(post.likedByCurrentUser || false);

  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const isOwner =
    currentUser?.users_id === post.users_id ||
    currentUser?.id === post.users_id;

  const toggleLike = async () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));

    try {
      if (liked) {
        await unlikePost({ users_id: currentUser.id, posts_id: post.posts_id });
      } else {
        await likePost({ users_id: currentUser.id, posts_id: post.posts_id });
      }
    } catch (err) {
      console.error("Like/unlike failed", err);
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? prev + 1 : prev - 1));
    }
  };

  const handleDropdownToggle = () => setShowDropdown(!showDropdown);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl p-6 mb-6 shadow-md border border-sky-100 hover:shadow-lg transition-shadow duration-300"
    >
      <Tooltip id="shared-tooltip" />

      {isEditing ? (
        <PostEditor
          initialContent={post.posts_content}
          buttonLabel="Save"
          onCancel={() => setIsEditing(false)}
          onSubmit={(updatedContent) => {
            onUpdate(post.posts_id, {
              posts_content: updatedContent,
              users_id: post.users_id,
            });
            setIsEditing(false);
          }}
          className="border-none p-0"
        />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 text-white flex items-center justify-center font-bold">
                {post.usersname?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {post.usersname || `User #${post.users_id}`}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(post.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {isOwner && (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={handleDropdownToggle}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                  data-tooltip-id="shared-tooltip"
                  data-tooltip-content="More Options"
                >
                  <MoreVertical size={18} />
                </button>

                {showDropdown && (
                  <Motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 shadow-md rounded-md z-10 overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      data-tooltip-id="shared-tooltip"
                      data-tooltip-content="Edit Post"
                    >
                      <Pencil size={16} className="mr-2" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        onDelete(post.posts_id);
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      data-tooltip-id="shared-tooltip"
                      data-tooltip-content="Delete Post"
                    >
                      <Trash2 size={16} className="mr-2" /> Delete
                    </button>
                  </Motion.div>
                )}
              </div>
            )}
          </div>

          <p className="mb-4 text-gray-700 whitespace-pre-wrap">
            {post.posts_content}
          </p>

          <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
                liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              }`}
              data-tooltip-id="shared-tooltip"
              data-tooltip-content={liked ? "Unlike" : "Like"}
            >
              <Heart size={18} className={liked ? "fill-current" : ""} />
              <span>{likes}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
                showComments
                  ? "text-blue-500"
                  : "text-gray-500 hover:text-blue-500"
              }`}
              data-tooltip-id="shared-tooltip"
              data-tooltip-content="View Comments"
            >
              <MessageCircle size={18} />
              <span>Comment</span>
            </button>
          </div>

          {showComments && (
            <Motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.2 }}
              className="mt-4 pt-3 border-t border-gray-100"
            >
              <CommentList postId={post.posts_id} currentUser={currentUser} />
            </Motion.div>
          )}
        </>
      )}
    </Motion.div>
  );
};

export default PostCard;
