# SocialSync — Redux Toolkit State Management Demo

A dynamic social media posting platform built to demonstrate **centralized state
management** using **Redux Toolkit** and **React-Redux**, as per the experiment brief.

## How to Run

```bash
npm install
npm start
```

App opens at `http://localhost:3000`.

## Where Each Objective Is Implemented

| Objective | File |
|---|---|
| Redux store configuration | `src/store/store.js` |
| Posts slice (CRUD + normalization) | `src/store/postsSlice.js` |
| Platforms slice | `src/store/platformsSlice.js` |
| Normalized state (entity adapter) | `postsAdapter` in `postsSlice.js` → state shape is `{ ids: [...], entities: { id: post } }` |
| Async data flow (mock API) | `src/api/mockApi.js` + `createAsyncThunk` calls `fetchPosts` / `publishPost` |
| Reducers for CRUD | `postUpdated`, `postDeleted`, `likeToggled` in `postsSlice.js` |
| Components connected via hooks | `useSelector` / `useDispatch` in every component under `src/components/` |
| Reduced prop drilling | No props are passed down for global data — every component reads directly from the store |

## App Features

- **Compose & Publish**: write a post, pick which *connected* platforms to publish
  to, and dispatch an async thunk that simulates a network request.
- **Feed**: posts are fetched via `fetchPosts` (async thunk) on mount, normalized
  into the store, and rendered sorted by newest first.
- **Edit / Delete / Like**: pure synchronous reducers mutate the normalized state
  via Immer (built into Redux Toolkit), so the code can "mutate" `state.entities[id]`
  directly and still be safe/immutable under the hood.
- **Platform Sidebar**: toggle a platform's connection status; only connected
  platforms are selectable in the composer — demonstrating cross-slice UI logic
  (platforms slice) driving what's shown/allowed elsewhere (posts slice).

## Redux Toolkit Concepts Demonstrated

1. **`configureStore`** — sets up the store, DevTools, and thunk middleware with
   almost no boilerplate.
2. **`createSlice`** — auto-generates action creators and action types for both
   `posts` and `platforms`.
3. **`createEntityAdapter`** — normalizes the posts collection (like a database
   table: `ids` + `entities`), giving built-in `selectAll`, `selectById` selectors
   and `setAll` / `addOne` / `removeOne` CRUD helpers.
4. **`createAsyncThunk`** — handles the `pending` / `fulfilled` / `rejected`
   lifecycle for `fetchPosts` and `publishPost`, so loading and error states are
   modeled explicitly in the slice via `extraReducers`.
5. **`react-redux` hooks** — `useSelector` reads state, `useDispatch` dispatches
   actions; no `connect()` HOC boilerplate needed.

## Extending to a Real Backend

Only `src/api/mockApi.js` needs to change — replace the `delay()` + in-memory
array logic with real `fetch()` calls to your backend. Because the thunks in
`postsSlice.js` just `await` whatever the API module returns, no other file
needs to change.
