import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  storeConversation,
  showConversation,
  showAllConversation,
  deleteConversation,
} from "../../services/conversationService";

// Async thunk to store conversation
export const storeConversationAsync = createAsyncThunk(
  "conversation/storeConversation",
  async (data, { rejectWithValue }) => {
    try {
      const response = await storeConversation(data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to store conversation"
      );
    }
  }
);

// Async thunk to fetch a single conversation by id
export const fetchConversationAsync = createAsyncThunk(
  "conversation/fetchConversation",
  async (id, { rejectWithValue }) => {
    try {
      const response = await showConversation(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch conversation"
      );
    }
  }
);

// Async thunk to fetch all conversations
export const fetchAllConversationsAsync = createAsyncThunk(
  "conversation/fetchAllConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await showAllConversation();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch conversations"
      );
    }
  }
);

// Async thunk to delete a conversation by id
export const deleteConversationAsync = createAsyncThunk(
  "conversation/deleteConversation",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteConversation(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete conversation"
      );
    }
  }
);

export const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    conversations: [],
    currentConversation: null,
    messages: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearConversations: (state) => {
      state.conversations = [];
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle storing conversation
      .addCase(storeConversationAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(storeConversationAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations.push(action.payload);
      })
      .addCase(storeConversationAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle fetching single conversation
      .addCase(fetchConversationAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchConversationAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentConversation = action.payload.data;
        state.messages = action.payload.messages || [];
      })
      .addCase(fetchConversationAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle fetching all conversations
      .addCase(fetchAllConversationsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllConversationsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations = action.payload;
      })
      .addCase(fetchAllConversationsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle deleting conversation
      .addCase(deleteConversationAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteConversationAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Remove the deleted conversation from the state
        state.conversations = state.conversations.filter(
          (conversation) => conversation.id !== action.meta.arg
        );
      })
      .addCase(deleteConversationAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearConversations, clearCurrentConversation } =
  conversationSlice.actions;

export const selectConversations = (state) => state.conversation.conversations;
export const selectCurrentConversation = (state) =>
  state.conversation.currentConversation;
export const selectMessages = (state) => state.conversation.messages;
export const selectConversationStatus = (state) => state.conversation.status;
export const selectConversationError = (state) => state.conversation.error;

export default conversationSlice.reducer;
