import createReducer from "../../../store/createReducer";
import * as types from "./types";

const initialState = {
  test: undefined,
};

const HomeReducer = createReducer(initialState, {
  [types.CLEAR](state) {
    return {
      ...state,
    };
  },

  [types.TEST](state, action) {
    return {
      ...state,
      test: action.payload,
    };
  },
});

export default HomeReducer;
