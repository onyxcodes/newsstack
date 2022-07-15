import {SEARCH} from '../../actions';
import search from './search';

export const performSearch = (query) => dispatch => {
    // THis following variables will be set from configs
    let count = 20,
        locale = "uk_UA";
    search(query, count, locale).then( res => {
        if (res) {
            dispatch({
                type: SEARCH,
                payload: {
                    query: query,
                    count: res?.length,
                    locale: locale,
                    content: res
                }
            })
        }
    })
}

const initialState = {value: 'Washington Post'};


export default function reducer(state = initialState, action) {
  switch(action.type) {
    case SEARCH: {
        return action.payload || null;
    }
    default:
      return state;
  }
}