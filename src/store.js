import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';
import search from './features/feedly';
import firebaseauth from './features/firebaseauth';
/* TODO: Configure reducers for:
 * Feedsearch
 * Google fact checker
 * Firebase auth
 * PouchDB
 */

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    // feeds: feedsearch,
    feeds: search,
    auth: firebaseauth
  },
});