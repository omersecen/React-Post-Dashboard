const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

export async function fetchPosts(signal) {
  const response = await fetch(POSTS_URL, { signal });

  if (!response.ok) {
    throw new Error(`Unable to load posts (HTTP ${response.status}). Please try again.`);
  }

  const posts = await response.json();
  if (!Array.isArray(posts)) {
    throw new Error('The server returned an invalid post list. Please try again.');
  }

  return posts;
}
