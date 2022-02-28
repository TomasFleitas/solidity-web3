import { all } from "redux-saga/effects";
import HomeSagas from "../pages/home/redux-sagas/saga";

export default function* rootSaga(getState) {
  yield all([HomeSagas()]);
}
