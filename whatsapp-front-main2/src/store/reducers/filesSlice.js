import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  uploadFiles,
  deleteFile,
  getAllFiles,
} from "../../services/filesServices";

// Async Thunks

// Upload Files
export const uploadFilesAsync = createAsyncThunk(
  "files/uploadFiles",
  async ({ name, content, id }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("path", content);
      formData.append("type", name);
      formData.append("user_id", id);
      const response = await uploadFiles(formData);
      console.log(response);

      return response.errNum; // Return only the 'data' part of the response
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Upload failed";
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Get All Files
export const getAllFilesAsync = createAsyncThunk(
  "files/getAllFiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllFiles();
      return response; // Return the 'data' part of the response
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// Delete File
export const deleteFileAsync = createAsyncThunk(
  "files/deleteFile",
  async (id, { rejectWithValue }) => {
    try {
      await deleteFile(id); // No need to return the full response
      return { id }; // Return the ID of the deleted file
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// Initial State
const initialState = {
  files: [],
  uploadStatus: "idle",
  uploadError: null,
  currentFileName: "",
  currentFileContent: null,
  allFilesFetchStatus: "idle", // State for fetching all files
  allFilesFetchError: null, // Error state for fetching all files
  yourSizeCount: 0, // To store yourSizeCount from response
  yourFreeSize: 0, // To store yourFreeSize from response
  deleteStatus: "idle",
  deleteError: null,
};

// Create Slice
const fileSlice = createSlice({
  name: "files",
  initialState,
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
    clearErrors: (state) => {
      state.uploadError = null;
      state.allFilesFetchError = null;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle uploadFilesAsync
      .addCase(uploadFilesAsync.pending, (state) => {
        state.uploadStatus = "loading";
        state.uploadError = null;
      })
      .addCase(uploadFilesAsync.fulfilled, (state, action) => {
        state.uploadStatus = "succeeded";
        state.files.push(action.payload[0]); // Add the first file from the 'data' array
        state.currentFileName = "";
        state.currentFileContent = null;
      })
      .addCase(uploadFilesAsync.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.uploadError = action.payload;
      })
      // Handle getAllFilesAsync
      .addCase(getAllFilesAsync.pending, (state) => {
        state.allFilesFetchStatus = "loading";
        state.allFilesFetchError = null;
      })
      .addCase(getAllFilesAsync.fulfilled, (state, action) => {
        state.allFilesFetchStatus = "succeeded";
        state.files = action.payload.data; // Update state with all files from 'data'
        state.yourSizeCount = action.payload.yourSizeCount; // Update with yourSizeCount from response
        state.yourFreeSize = action.payload.yourFreeSize; // Update with yourFreeSize from response
      })
      .addCase(getAllFilesAsync.rejected, (state, action) => {
        state.allFilesFetchStatus = "failed";
        state.allFilesFetchError = action.payload;
      })
      // Handle deleteFileAsync
      .addCase(deleteFileAsync.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteFileAsync.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.files = state.files.filter(
          (file) => file.id !== action.payload.id
        ); // Remove the deleted file from the list
      })
      .addCase(deleteFileAsync.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload;
      });
  },
});

// Export actions and reducer
export const {
  setCurrentFileName,
  setCurrentFileContent,
  clearCurrentFile,
  clearErrors,
} = fileSlice.actions;

export default fileSlice.reducer;

// Selectors
export const selectAllFiles = (state) => state.files.files;
export const selectUploadStatus = (state) => state.files.uploadStatus;
export const selectUploadError = (state) => state.files.uploadError;
export const selectCurrentFileName = (state) => state.files.currentFileName;
export const selectCurrentFileContent = (state) =>
  state.files.currentFileContent;
export const selectAllFilesFetchStatus = (state) =>
  state.files.allFilesFetchStatus;
export const selectAllFilesFetchError = (state) =>
  state.files.allFilesFetchError;
export const selectDeleteStatus = (state) => state.files.deleteStatus;
export const selectDeleteError = (state) => state.files.deleteError;
export const selectYourSizeCount = (state) => state.files.yourSizeCount;
export const selectYourFreeSize = (state) => state.files.yourFreeSize;
