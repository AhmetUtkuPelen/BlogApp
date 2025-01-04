import { createSlice, PayloadAction } from '@reduxjs/toolkit';


// ? Define the type for the user ? \\
interface UserType {
  _id: string;
  id: string;
  name: string;
  email: string;
  username:string;
  profilePicture: string;
  isAdmin?: boolean;
}

// ? Define the initial state type ? \\
interface UserState {
  currentUser: UserType | null;
  error: string | null;
  loading: boolean;
}

// ? Initial state ? \\
const initialState: UserState = {
  currentUser: null,
  error: null,
  loading: false,
};

// ? Create the user slice ? \\
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action: PayloadAction<UserType>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateStart: (state) => {
      state.loading = false;
      state.error = null;
    },
    updateSuccess: (state, action: PayloadAction<UserType>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

// ? Export the actions ? \\
export const { signInStart, signInSuccess, signInFailure, updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure } = userSlice.actions;

// ? Export the reducer ? \\
export default userSlice.reducer;