import React from "react";
import Header from "./components/Header";
import PlatformSidebar from "./components/PlatformSidebar";
import PostComposer from "./components/PostComposer";
import PostList from "./components/PostList";

export default function App() {
  return (
    <div className="app">
      <Header />
      <div className="layout">
        <PlatformSidebar />
        <main className="main">
          <PostComposer />
          <PostList />
        </main>
      </div>
    </div>
  );
}
