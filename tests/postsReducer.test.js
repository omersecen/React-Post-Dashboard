import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, postsReducer } from '../src/reducer/postsReducer.js';

test('initial state matches the assignment', () => {
  assert.deepEqual(initialState, { posts: [], loading: false, error: null });
});

test('fetch start clears an old error without mutating state', () => {
  const state = Object.freeze({ posts: [], loading: false, error: 'Offline' });
  const next = postsReducer(state, { type: 'FETCH_START' });
  assert.deepEqual(next, { posts: [], loading: true, error: null });
  assert.equal(state.error, 'Offline');
  assert.notEqual(next, state);
});

test('success stores source posts and ends loading', () => {
  const posts = Object.freeze([{ id: 1, title: 'A post', body: 'A body' }]);
  const state = Object.freeze({ posts: [], loading: true, error: null });
  const next = postsReducer(state, { type: 'FETCH_SUCCESS', payload: posts });
  assert.deepEqual(next, { posts, loading: false, error: null });
  assert.equal(state.loading, true);
  assert.notEqual(next, state);
});

test('error ends loading and stores a readable message', () => {
  const state = Object.freeze({ posts: [], loading: true, error: null });
  const next = postsReducer(state, { type: 'FETCH_ERROR', payload: 'Connection failed' });
  assert.deepEqual(next, { posts: [], loading: false, error: 'Connection failed' });
  assert.equal(state.error, null);
});

test('an error can be followed by a successful retry with an empty list', () => {
  const error = postsReducer(initialState, { type: 'FETCH_ERROR', payload: 'Offline' });
  const loading = postsReducer(error, { type: 'FETCH_START' });
  const result = postsReducer(loading, { type: 'FETCH_SUCCESS', payload: [] });
  assert.deepEqual(result, initialState);
  assert.equal(loading.error, null);
  assert.equal(loading.loading, true);
});

test('unknown actions preserve values in a new object', () => {
  const next = postsReducer(Object.freeze(initialState), { type: 'UNKNOWN' });
  assert.deepEqual(next, initialState);
  assert.notEqual(next, initialState);
});
