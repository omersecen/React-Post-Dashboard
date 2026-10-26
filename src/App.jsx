import { useEffect, useReducer, useState } from 'react';
import { fetchPosts } from './api/postsApi.js';
import FilterForm from './components/FilterForm.jsx';
import PostList from './components/PostList.jsx';
import { initialState, postsReducer } from './reducer/postsReducer.js';

export default function App() {
  const [state, dispatch] = useReducer(postsReducer, initialState);
  const [filter, setFilter] = useState('');
  const [requestNumber, setRequestNumber] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadPosts() {
      dispatch({ type: 'FETCH_START' });
      try {
        const posts = await fetchPosts(controller.signal);
        if (active) dispatch({ type: 'FETCH_SUCCESS', payload: posts });
      } catch (error) {
        if (active) {
          dispatch({
            type: 'FETCH_ERROR',
            payload: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
          });
        }
      }
    }

    loadPosts();

    return () => {
      active = false;
      controller.abort();
    };
  }, [requestNumber]);

  const query = filter.trim().toLowerCase();
  const filteredPosts = state.posts.filter((post) => post.title.toLowerCase().includes(query));

  return (
    <main className="dashboard">
      <header className="page-header">
        <p className="eyebrow">WEB PROGRAMMING / ASSIGNMENT 6</p>
        <h1>Post Dashboard<span aria-hidden="true">.</span></h1>
        <p className="intro">A little reading, a new perspective. Explore the latest posts.</p>
      </header>

      <section className="toolbar" aria-label="Post filters">
        <FilterForm filter={filter} onFilterChange={setFilter} disabled={state.loading || Boolean(state.error)} />
        <p className="post-count" role="status" aria-live="polite">
          {state.loading ? 'Fetching posts…' : state.error ? 'Posts unavailable' : `${filteredPosts.length} of ${state.posts.length} posts`}
        </p>
      </section>

      <section className="results" aria-label="Post results" aria-busy={state.loading}>
        {state.loading ? (
          <div className="state-panel" role="status">
            <span className="loading-dot" aria-hidden="true" />
            <h2>Loading posts...</h2>
            <p>Getting your reading list ready.</p>
          </div>
        ) : state.error ? (
          <div className="state-panel error-panel" role="alert">
            <h2>We couldn’t load the posts</h2>
            <p>{state.error}</p>
            <button type="button" onClick={() => setRequestNumber((number) => number + 1)}>Try again</button>
          </div>
        ) : state.posts.length === 0 ? (
          <div className="state-panel" role="status">
            <h2>No posts available.</h2>
            <p>The server returned an empty reading list.</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="state-panel" role="status">
            <h2>No matching posts</h2>
            <p>No titles match “{filter}”. Try another search.</p>
            <button type="button" onClick={() => setFilter('')}>Clear filter</button>
          </div>
        ) : (
          <PostList posts={filteredPosts} />
        )}
      </section>

      <footer className="page-footer">
        <p>Omer Secen <span aria-hidden="true">/</span> Fall 2026</p>
        <a href="https://jsonplaceholder.typicode.com/">Sample posts from JSONPlaceholder ↗</a>
      </footer>
    </main>
  );
}
