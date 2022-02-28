import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import HomeReducer from "../pages/home/redux-sagas/reducer";

const createRootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    home: HomeReducer,
  });

export default createRootReducer;
