import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, selectAllPosts, selectPostsStatus, selectPostsError } from "../store/postsSlice";
import PostCard from "./PostCard";

export default function PostList() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const status = useSelector(selectPostsStatus);
  const error = useSelector(selectPostsError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return <p className="status-msg">Loading posts…</p>;
  }
  if (status === "failed") {
    return <p className="status-msg error">Failed to load posts: {error}</p>;
  }

  return (
    <div className="post-list">
      {posts.length === 0 && <p className="status-msg">No posts yet. Publish something!</p>}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
