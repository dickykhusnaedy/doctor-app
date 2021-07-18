import {createStore} from 'redux';

const initialState = {
  loading: false,
  message: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.value,
      };
    case 'MESSAGE_COUNT':
      return {
        ...state,
        message: action.value,
      };

    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
