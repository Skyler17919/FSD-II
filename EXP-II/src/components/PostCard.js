import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postDeleted, postUpdated, likeToggled } from "../store/postsSlice";
import { selectAllPlatforms } from "../store/platformsSlice";

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const platforms = useSelector(selectAllPlatforms);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(post.content);

  const platformMeta = (id) => platforms.find((p) => p.id === id);

  const saveEdit = () => {
    dispatch(postUpdated({ id: post.id, content: draft, platforms: post.platforms }));
    setIsEditing(false);
  };

  return (
    <div className="post-card">
      <div className="post-card-top">
        <div className="avatar">{post.author.charAt(0)}</div>
        <div>
          <div className="author">{post.author}</div>
          <div className="timestamp">{new Date(post.createdAt).toLocaleString()}</div>
        </div>
      </div>

      {isEditing ? (
        <textarea
          className="edit-textarea"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
        />
      ) : (
        <p className="post-content">{post.content}</p>
      )}

      <div className="post-platforms">
        {post.platforms.map((id) => {
          const meta = platformMeta(id);
          if (!meta) return null;
          return (
            <span key={id} className="platform-tag" style={{ background: meta.color }}>
              {meta.name}
            </span>
          );
        })}
      </div>

      <div className="post-actions">
        <button className={`like-btn ${post.liked ? "liked" : ""}`} onClick={() => dispatch(likeToggled(post.id))}>
          {post.liked ? "♥" : "♡"} {post.likes}
        </button>
        {isEditing ? (
          <>
            <button className="text-btn" onClick={saveEdit}>Save</button>
            <button className="text-btn" onClick={() => { setIsEditing(false); setDraft(post.content); }}>Cancel</button>
          </>
        ) : (
          <button className="text-btn" onClick={() => setIsEditing(true)}>Edit</button>
        )}
        <button className="text-btn danger" onClick={() => dispatch(postDeleted(post.id))}>Delete</button>
      </div>
    </div>
  );
}
