import * as types from "./types";

const result = (type, payload) => {
  return {
    type: type,
    payload: payload,
  };
};

export const clear = payload => result(types.CLEAR, payload);

export const TEST = payload => result(types.TEST, payload);
