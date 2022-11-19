/* eslint-disable import/no-anonymous-default-export */
import * as actionTypes from "../actions/actionTypes";

export const defaultState = {
  address: ''
};

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case actionTypes.ADDRESS_CHANGE:
      return {
        ...state,
        data: action.payload
      };

    default:
      return state;
  }
};
