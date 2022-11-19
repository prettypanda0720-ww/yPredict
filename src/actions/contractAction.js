import * as actionTypes from "./actionTypes";

export const setContract = (address) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.ADDRESS_CHANGE,
      payload: {
        address,
      }
    });
  }
}