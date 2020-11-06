import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../common/axios';

const initialState = {
  isRegistrationInProgress: false,
  registrationMessage: {
    success: true,
    text: '',
  },
};

const registerUser = createAsyncThunk(
  'user/register',
  (registrationData, { rejectWithValue }) => {
    return axios
      .post('/api/auth/register', registrationData)
      .then((response) => response.data)
      .catch((error) => rejectWithValue(error.response.data));
  }
);

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  extraReducers: {
    [registerUser.pending]: (state) => {
      state.isRegistrationInProgress = true;
    },
    [registerUser.fulfilled]: (state, action) => {
      state.isRegistrationInProgress = false;
      state.registrationMessage.success = true;
      state.registrationMessage.text = action.payload.message;
    },
    [registerUser.rejected]: (state, action) => {
      state.isRegistrationInProgress = false;
      state.registrationMessage.success = false;
      state.registrationMessage.text = action.payload.message;
    },
  },
});

const { reducer: registrationReducer } = registrationSlice;
export { registrationReducer, registerUser };
