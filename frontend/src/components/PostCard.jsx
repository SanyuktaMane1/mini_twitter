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
  const [liked, setLiked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  const isOwner =
    currentUser?.users_id === post.users_id ||
    currentUser?.id === post.users_id;

  const toggleLike = async () => {
    try {
      if (liked) {
        await unlikePost({ users_id: currentUser.id, posts_id: post.posts_id });
        setLikes((prev) => prev - 1);
      } else {
        await likePost({ users_id: currentUser.id, posts_id: post.posts_id });
        setLikes((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (err) {
      console.error("Like/unlike failed", err);
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="border rounded p-4 mb-4 shadow relative"
    >
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
        />
      ) : (
        <>
          <div className="flex items-center space-x-2 mb-2 justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                {post.usersname?.slice(0, 1).toUpperCase() || "U"}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-black">
                  {post.usersname || `User #${post.users_id}`}
                </span>
                <span className="mx-1 text-gray-400">•</span>
                <span className="text-gray-500">
                  {new Date(post.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </p>
            </div>

            {isOwner && (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={handleDropdownToggle}
                  className="p-1 rounded hover:bg-gray-200"
                  data-tooltip-id="options-tooltip"
                  data-tooltip-content="More"
                >
                  <MoreVertical size={20} />
                </button>
                <Tooltip id="options-tooltip" />

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-28 bg-white border shadow-md rounded z-10">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100"
                      data-tooltip-id="edit-tooltip"
                      data-tooltip-content="Edit Post"
                    >
                      <Pencil size={16} className="mr-2" /> Edit
                    </button>
                    <Tooltip id="edit-tooltip" />

                    <button
                      onClick={() => {
                        onDelete(post.posts_id);
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                      data-tooltip-id="delete-tooltip"
                      data-tooltip-content="Delete Post"
                    >
                      <Trash2 size={16} className="mr-2" /> Delete
                    </button>
                    <Tooltip id="delete-tooltip" />
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="mb-2 whitespace-pre-wrap">{post.posts_content}</p>

          <div className="flex items-center gap-6 mt-3 text-gray-600">
            <button
              onClick={toggleLike}
              className="flex items-center gap-1"
              data-tooltip-id="like-tooltip"
              data-tooltip-content={liked ? "Unlike" : "Like"}
            >
              <Heart
                size={20}
                className={liked ? "text-red-500" : ""}
                fill={liked ? "red" : "none"}
              />
              <span>{likes}</span>
            </button>
            <Tooltip id="like-tooltip" />

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1"
              data-tooltip-id="comment-tooltip"
              data-tooltip-content="Reply"
            >
              <MessageCircle size={20} />
              <span>{showComments}</span>
            </button>
            <Tooltip id="comment-tooltip" />
          </div>

          {showComments && (
            <div className="mt-4">
              <CommentList postId={post.posts_id} currentUser={currentUser} />
            </div>
          )}
        </>
      )}
    </Motion.div>
  );
};

export default PostCard;
