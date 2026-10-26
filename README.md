# Post Dashboard — Assignment 6

A small React app for Web Programming, Fall 2026. It loads posts from JSONPlaceholder and filters them by title.

## Run locally

Use Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. For a production build, run `npm run build`. Use `npm run preview` to view that build.

## File organization

```text
src/
  api/postsApi.js
  components/
    Post.jsx
    PostList.jsx
    FilterForm.jsx
  reducer/postsReducer.js
  App.jsx
  main.jsx
  styles.css
tests/
  postsApi.test.js
  postsReducer.test.js
```

- `postsApi.js` uses `fetch`, checks HTTP responses and returns parsed JSON. It has no React or UI code.
- `postsReducer.js` keeps `posts`, `loading` and `error` together. It handles `FETCH_START`, `FETCH_SUCCESS` and `FETCH_ERROR` without changing the previous state.
- `App.jsx` owns the reducer and filter input. Its effect loads posts and cleans up requests. Retry starts a new request after a failure.
- `PostList.jsx` maps posts to `Post` components using each post's ID as the key. `Post.jsx` only displays a title and body.
- `FilterForm.jsx` receives its input value and change handler from App.

## Main challenges

One challenge was handling requests that finish after a component unmounts. The effect uses an `AbortController` and an active flag, so cancelled or outdated requests cannot update the state. This also works with React StrictMode's extra setup and cleanup in development.

Another challenge was keeping filtering separate from fetching. Only the original posts are stored in the reducer. The filtered list is calculated during render from the current title input. Searching ignores case and surrounding spaces.

The app shows different messages for loading, request errors, an empty API response and a search with no matches. It uses React, the browser Fetch API and plain CSS, without UI or data-fetching libraries.

## Checks

```sh
npm test
npm run build
```

The tests cover reducer transitions, immutable updates, HTTP and network failures, malformed responses, empty data and request cancellation. Chrome checks cover loading real posts, filtering titles, clearing the filter and no matching results.

`node_modules` and the generated `dist` directory are excluded from Git. Dependencies are recorded in `package-lock.json`.

Data: [JSONPlaceholder posts](https://jsonplaceholder.typicode.com/posts).
