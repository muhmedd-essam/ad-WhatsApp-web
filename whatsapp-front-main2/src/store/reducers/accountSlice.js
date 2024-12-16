import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { storeAccount, getAccounts } from "../../services/accountService";

// Async thunk for storing account data
export const storeAccountAsync = createAsyncThunk(
  "account/storeAccount",
  async (accountData, { rejectWithValue }) => {
    try {
      const response = await storeAccount(accountData);
      // console.log(response);
      return response; // Assuming response contains the stored account details
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to store account");
    }
  }
);

// Async thunk for fetching accounts
export const fetchAccountsAsync = createAsyncThunk(
  "account/fetchAccounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAccounts();
      return response; // Assuming response contains the list of accounts
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch accounts"
      );
    }
  }
);

// Create account slice
export const accountSlice = createSlice({
  name: "account",
  initialState: {
    accounts: {}, // To store account details like numbers, plan, etc.
    status: "idle",
    error: null,
  },
  reducers: {
    clearAccounts: (state) => {
      state.accounts = {}; // Clear accounts if needed
    },
  },
  extraReducers: (builder) => {
    // Handling storeAccountAsync
    builder
      .addCase(storeAccountAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(storeAccountAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accounts = action.payload; // Update account data
      })
      .addCase(storeAccountAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handling fetchAccountsAsync
      .addCase(fetchAccountsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAccountsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accounts = action.payload; // Set the fetched accounts
      })
      .addCase(fetchAccountsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export the actions from the slice
export const { clearAccounts } = accountSlice.actions;

// Selectors
export const selectAccounts = (state) => state.account.accounts;
export const selectAccountStatus = (state) => state.account.status;
export const selectAccountError = (state) => state.account.error;

// Export the reducer to be used in the store
export default accountSlice.reducer;
