// mockApi.js
// Simulates a backend so the app can demonstrate async thunks (createAsyncThunk)
// without needing a real server. Swap this out for real fetch() calls later —
// the slice code that calls it never has to change.

let _idCounter = 4;

const seedPosts = [
  {
    id: "1",
    author: "Aarav Sharma",
    content: "Just shipped a new feature using Redux Toolkit — normalized state makes CRUD so much cleaner! 🚀",
    platforms: ["twitter", "linkedin"],
    likes: 12,
    liked: false,
    createdAt: "2026-07-28T09:15:00Z",
  },
  {
    id: "2",
    author: "Priya Verma",
    content: "Coffee, code, repeat ☕️💻 #DeveloperLife",
    platforms: ["instagram"],
    likes: 34,
    liked: true,
    createdAt: "2026-07-29T14:02:00Z",
  },
  {
    id: "3",
    author: "Rohan Mehta",
    content: "Excited to share our team's approach to scalable state architecture at the meetup next week!",
    platforms: ["linkedin", "facebook"],
    likes: 8,
    liked: false,
    createdAt: "2026-07-30T18:40:00Z",
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchPostsApi() {
  await delay(700); // simulate network latency
  return seedPosts;
}

export async function publishPostApi({ author, content, platforms }) {
  await delay(900); // simulate time to "post" to each connected platform

  // Simulate an occasional failure so the UI can demonstrate rejected thunks
  if (!content || !content.trim()) {
    throw new Error("Post content cannot be empty.");
  }

  const newPost = {
    id: String(_idCounter++),
    author,
    content,
    platforms,
    likes: 0,
    liked: false,
    createdAt: new Date().toISOString(),
  };
  return newPost;
}
