import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchPosts } from '../src/api/postsApi.js';

test('fetchPosts returns parsed posts and passes the abort signal', async (t) => {
  const posts = [{ id: 1, title: 'First post', body: 'Post body' }];
  const controller = new AbortController();
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://jsonplaceholder.typicode.com/posts');
    assert.equal(options.signal, controller.signal);
    return { ok: true, json: async () => posts };
  });
  assert.deepEqual(await fetchPosts(controller.signal), posts);
});

test('fetchPosts accepts an empty list', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => ({ ok: true, json: async () => [] }));
  assert.deepEqual(await fetchPosts(), []);
});

test('fetchPosts rejects unsuccessful HTTP responses', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => ({ ok: false, status: 503 }));
  await assert.rejects(fetchPosts(), /HTTP 503/);
});

test('fetchPosts preserves network errors for the caller', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('Failed to fetch'); });
  await assert.rejects(fetchPosts(), /Failed to fetch/);
});

test('fetchPosts rejects malformed JSON', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => ({
    ok: true,
    json: async () => { throw new SyntaxError('Invalid JSON'); },
  }));
  await assert.rejects(fetchPosts(), /Invalid JSON/);
});

test('fetchPosts rejects a response that is not a list', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => ({ ok: true, json: async () => ({ message: 'error' }) }));
  await assert.rejects(fetchPosts(), /invalid post list/);
});

test('fetchPosts preserves abort errors', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => { throw new DOMException('Aborted', 'AbortError'); });
  await assert.rejects(fetchPosts(), { name: 'AbortError' });
});
