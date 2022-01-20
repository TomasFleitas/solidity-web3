import { createBrowserHistory } from "history";
import { createStore, compose, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { routerMiddleware } from "connected-react-router";
import { withReduxStateSync, createStateSyncMiddleware, initMessageListener } from "redux-state-sync";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducers from "./reducers";
import rootSagas from "./sagas";

const persistConfig = {
  key: "root",
  storage,
  blacklist: [
    //acá meto el que quiero que no persiste
  ],
};

const config = {
  whitelist: [],
};

const history = createBrowserHistory();

const middleware = [];

const sagaMiddleware = createSagaMiddleware();
middleware.push(routerMiddleware(history));
middleware.push(sagaMiddleware);
middleware.push(createStateSyncMiddleware(config));

const persistedReducer = persistReducer(persistConfig, rootReducers(history));

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  withReduxStateSync(persistedReducer),
  undefined,
  composeEnhancers(applyMiddleware(...middleware))
);

sagaMiddleware.run(rootSagas);
initMessageListener(store);
let persistor = persistStore(store);

export { store, history, persistor };
