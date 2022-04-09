import { authRef, provider } from '../../config/firebase';
import { FETCH_USER } from '../../actions';

export const fetchUser = () => dispatch => {
    authRef.onAuthStateChanged(user => {
      if (user) {
        // NOTE: store only user uid for now
        let res = user?._delegate?.uid
        dispatch({
          type: FETCH_USER,
          payload: res
        });
      } else {
        dispatch({
          type: FETCH_USER,
          payload: null
        });
      }
    });
};

export const signIn = () => dispatch => {
    authRef
      .signInWithPopup(provider)
      .then(result => {
      })
      .catch(error => {
        console.log(error);
      });
  };
  
export const signOut = () => dispatch => {
    authRef
      .signOut()
      .then(() => {
        // Sign-out successful.
      })
      .catch(error => {
        console.log(error);
      });
};

export default (state = false, action) => {
  switch (action.type) {
    case FETCH_USER:
      return action.payload || null;
    default:
      return state;
  }
};