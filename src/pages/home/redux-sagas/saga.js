import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import * as types from "./types";
import * as actions from "./actions";
import { checklist } from "../../../api";

/* function* create({ payload }) {
  try {
    const { data } = yield call(checklist.create, payload);
    yield put(actions.createChecklistSuccess(data));
  } catch (error) {
    yield put(actions.createChecklistError(error?.response?.data?.message));
  }
}

export function* watchCreate() {
  yield takeEvery(types.CREATE_CHECKLIST, create);
} */

function* HomeSagas() {
  yield all([
    /* fork(watchCreate) */
  ]);
}

export default HomeSagas;
