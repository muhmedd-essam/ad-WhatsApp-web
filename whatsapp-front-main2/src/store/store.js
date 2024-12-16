import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./reducers/profileReducer";
import contactReducer from "./reducers/contactSlice";
import filesReducer from "./reducers/filesSlice";
import accountSlice from "./reducers/accountSlice";
import conversationSlice from "./reducers/conversationSlice";

const store = configureStore({
  reducer: {
    profile: profileReducer,
    contacts: contactReducer,
    files: filesReducer,
    account: accountSlice,
    conversation: conversationSlice,
  },
});

export default store;
