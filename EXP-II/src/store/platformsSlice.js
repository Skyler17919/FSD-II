import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  entities: {
    twitter: { id: "twitter", name: "Twitter / X", color: "#1d9bf0", connected: true, followers: 2400 },
    instagram: { id: "instagram", name: "Instagram", color: "#e1306c", connected: true, followers: 5100 },
    facebook: { id: "facebook", name: "Facebook", color: "#1877f2", connected: false, followers: 1800 },
    linkedin: { id: "linkedin", name: "LinkedIn", color: "#0a66c2", connected: true, followers: 3200 },
  },
  ids: ["twitter", "instagram", "facebook", "linkedin"],
};

const platformsSlice = createSlice({
  name: "platforms",
  initialState,
  reducers: {
    connectionToggled(state, action) {
      const platform = state.entities[action.payload];
      if (platform) platform.connected = !platform.connected;
    },
    followersBumped(state, action) {
      // Demo reducer: simulate follower growth when a post goes out on a platform
      const platform = state.entities[action.payload];
      if (platform) platform.followers += Math.floor(Math.random() * 5) + 1;
    },
  },
});

export const { connectionToggled, followersBumped } = platformsSlice.actions;

// --- Selectors ---
export const selectAllPlatforms = (state) => state.platforms.ids.map((id) => state.platforms.entities[id]);
export const selectConnectedPlatforms = (state) => selectAllPlatforms(state).filter((p) => p.connected);
export const selectPlatformById = (state, id) => state.platforms.entities[id];

export default platformsSlice.reducer;
