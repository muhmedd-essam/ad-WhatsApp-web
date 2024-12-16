import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updateUserData, changePassword } from "../../services/profileService";

// Thunk for updating the profile
export const updateProfileAsync = createAsyncThunk(
  "profile/updateProfileAsync",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await updateUserData(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update profile"
      );
    }
  }
);

// Thunk for changing the password
export const changePasswordAsync = createAsyncThunk(
  "profile/changePasswordAsync",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await changePassword(passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to change password"
      );
    }
  }
);

// Initial state
const initialState = {
  profile: {
    name: "",
    company: "",
    tax_number: "",
  },
  status: "idle", // Status for profile update
  error: null,
  passwordStatus: "idle", // Status for password change
  passwordError: null,
};

// Create a slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearErrors(state) {
      state.error = null;
      state.passwordError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Profile Cases
      .addCase(updateProfileAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Change Password Cases
      .addCase(changePasswordAsync.pending, (state) => {
        state.passwordStatus = "loading";
      })
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.passwordStatus = "succeeded";
        state.passwordError = null;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.passwordStatus = "failed";
        state.passwordError = action.payload;
      });
  },
});

// Export the action creators and selectors
export const { clearErrors } = profileSlice.actions;

// Selectors
export const selectProfileUpdateStatus = (state) => state.profile.status;
export const selectPasswordChangeStatus = (state) =>
  state.profile.passwordStatus;

// Export the reducer
export default profileSlice.reducer;
