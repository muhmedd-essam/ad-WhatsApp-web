// Add these imports at the top if not already there
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  uploadContacts,
  getContacts,
  deleteContact,
} from "../../services/contactService";

// Async thunk to upload contacts
export const uploadContactsAsync = createAsyncThunk(
  "contacts/uploadContacts",
  async ({ name, content }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", content);
      formData.append("list_name", name);

      const response = await uploadContacts(formData);
      return response;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: error.message });
    }
  }
);

// Async thunk to fetch contacts
export const getContactsAsync = createAsyncThunk(
  "contacts/getContacts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getContacts();
      return response;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: error.message });
    }
  }
);

// Async thunk to delete a contact
export const deleteContactAsync = createAsyncThunk(
  "contacts/deleteContact",
  async ({ name }, { rejectWithValue }) => {
    try {
      const response = await deleteContact(name);
      return { name, response };
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: error.message });
    }
  }
);

const contactSlice = createSlice({
  name: "contacts",
  initialState: {
    contacts: [],
    status: "idle", // For upload actions
    error: null,
    currentFileName: "",
    currentFileContent: null,
    fetchStatus: "idle", // For fetching contacts
    fetchError: null,
    deleteStatus: "idle", // For delete actions
    deleteError: null,
  },
  reducers: {
    setCurrentFileName: (state, action) => {
      state.currentFileName = action.payload;
    },
    setCurrentFileContent: (state, action) => {
      state.currentFileContent = action.payload;
    },
    clearCurrentFile: (state) => {
      state.currentFileName = "";
      state.currentFileContent = null;
    },
    clearError: (state) => {
      state.error = null;
      state.fetchError = null;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload contacts
      .addCase(uploadContactsAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(uploadContactsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.contacts = action.payload;
        state.currentFileName = "";
        state.currentFileContent = null;
        state.error = null;
      })
      .addCase(uploadContactsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch contacts
      .addCase(getContactsAsync.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(getContactsAsync.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.contacts = action.payload;
        state.fetchError = null;
      })
      .addCase(getContactsAsync.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.payload;
      })

      // Delete contact
      .addCase(deleteContactAsync.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteContactAsync.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.contacts = state.contacts.filter(
          (contact) => contact.list_name !== action.payload.name
        );
        state.deleteError = null;
      })
      .addCase(deleteContactAsync.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload;
      });
  },
});

// Define the missing selectors
export const selectCurrentFileName = (state) => state.contacts.currentFileName;
export const selectCurrentFileContent = (state) =>
  state.contacts.currentFileContent;
export const selectContactsStatus = (state) => state.contacts.status;
export const selectContactsError = (state) => state.contacts.error;

export const {
  setCurrentFileName,
  setCurrentFileContent,
  clearCurrentFile,
  clearError,
} = contactSlice.actions;

export default contactSlice.reducer;

// Selectors for accessing contacts slice state
export const selectAllContacts = (state) => state.contacts.contacts;
export const selectContactsFetchStatus = (state) => state.contacts.fetchStatus;
export const selectContactsFetchError = (state) => state.contacts.fetchError;
export const selectContactsDeleteStatus = (state) =>
  state.contacts.deleteStatus;
export const selectContactsDeleteError = (state) => state.contacts.deleteError;
