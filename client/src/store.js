import { configureStore, getDefaultMiddleware } from "redux-starter-kit";
import kanbanReducer from "./modules/kanban";
import thunk from "redux-thunk";

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: {
      kanban: kanbanReducer,
    },
    middleware: [...getDefaultMiddleware(), thunk],
    devTools: true,
    preloadedState,
  });

  return store;
}
