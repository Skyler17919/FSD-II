import React, { useState } from "react";
import "./PostComposer.css";

function PostComposer() {
  const [platform, setPlatform] = useState("Twitter");
  const [post, setPost] = useState("");

  const limits = {
    Twitter: 280,
    Facebook: 5000,
    LinkedIn: 3000,
    Instagram: 2200,
  };

  const maxLength = limits[platform];
  const remaining = maxLength - post.length;

  return (
    <div className="container">
      <h2>Dynamic Post Composer</h2>

      <label>Select Platform</label>

      <select
        value={platform}
        onChange={(e) => {
          setPlatform(e.target.value);
          setPost("");
        }}
      >
        <option>Twitter</option>
        <option>Facebook</option>
        <option>LinkedIn</option>
        <option>Instagram</option>
      </select>

      <textarea
        placeholder="Write your post..."
        value={post}
        onChange={(e) => setPost(e.target.value)}
      />

      <p>
        Characters: {post.length}/{maxLength}
      </p>

      {remaining < 0 ? (
        <p className="error">❌ Character limit exceeded!</p>
      ) : (
        <p className="success">✅ Remaining: {remaining}</p>
      )}

      <button disabled={remaining < 0 || post.length === 0}>
        Publish
      </button>
    </div>
  );
}

export default PostComposer;