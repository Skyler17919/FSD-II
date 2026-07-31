import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { publishPost, selectPublishStatus } from "../store/postsSlice";
import { selectConnectedPlatforms, followersBumped } from "../store/platformsSlice";

export default function PostComposer() {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const connectedPlatforms = useSelector(selectConnectedPlatforms);
  const publishStatus = useSelector(selectPublishStatus);
  const dispatch = useDispatch();

  const togglePlatform = (id) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || selectedPlatforms.length === 0) return;

    const result = await dispatch(
      publishPost({ author: "You", content, platforms: selectedPlatforms })
    );

    if (publishPost.fulfilled.match(result)) {
      selectedPlatforms.forEach((id) => dispatch(followersBumped(id)));
      setContent("");
      setSelectedPlatforms([]);
    }
  };

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <textarea
        placeholder="What's happening?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />
      <div className="platform-chips">
        {connectedPlatforms.map((p) => (
          <button
            type="button"
            key={p.id}
            className={`chip ${selectedPlatforms.includes(p.id) ? "selected" : ""}`}
            style={{ borderColor: p.color, color: selectedPlatforms.includes(p.id) ? "#fff" : p.color, background: selectedPlatforms.includes(p.id) ? p.color : "transparent" }}
            onClick={() => togglePlatform(p.id)}
          >
            {p.name}
          </button>
        ))}
        {connectedPlatforms.length === 0 && (
          <span className="sidebar-hint">Connect a platform in the sidebar to post.</span>
        )}
      </div>
      <button
        type="submit"
        className="publish-btn"
        disabled={publishStatus === "loading" || !content.trim() || selectedPlatforms.length === 0}
      >
        {publishStatus === "loading" ? "Publishing…" : "Publish"}
      </button>
    </form>
  );
}
