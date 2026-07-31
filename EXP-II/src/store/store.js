import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./postsSlice";
import platformsReducer from "./platformsSlice";

// configureStore wires up the Redux DevTools, thunk middleware, and combines
// reducers automatically — this is the "single source of truth" for the app.
export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platforms: platformsReducer,
  },
});
