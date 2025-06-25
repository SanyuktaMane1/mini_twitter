import React, { useState } from "react";

const PostEditor = ({
  initialContent = "",
  onSubmit,
  onCancel,
  buttonLabel = "Post",
}) => {
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed) {
      setError("Content text cannot be empty..");
      return;
    }
    if (trimmed.length < 5) {
      setError("Content must be at least 5 characters.");
      return;
    }
    if (trimmed.length > 280) {
      setError("Content must be 280 characters or less.");
      return;
    }
    setError("");
    onSubmit(trimmed, setError);
    setContent("");
  };

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          if (error && e.target.value.trim()) setError("");
        }}
        maxLength={280}
        rows={3}
        placeholder="What's on your mind?"
        className="w-full p-2 border rounded mb-1"
      />
      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
        <span>{280 - content.length} characters remaining</span>
        {error && <span className="text-red-600">{error}</span>}
      </div>
      <div className="flex gap-2 pb-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-1  rounded hover:bg-blue-700"
        >
          {buttonLabel}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default PostEditor;
