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
      .catch((error) =>
        rejectWithValue(error.response ? error.response.data : error.message)
      );
  }
);

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setFormMessage: (state, { payload: { success, text } }) => {
      return {
        ...state,
        registrationMessage: {
          success: success,
          text: text,
        },
      };
    },
  },
  extraReducers: {
    [registerUser.pending]: (state) => {
      return {
        ...state,
        isRegistrationInProgress: true,
      };
    },
    [registerUser.fulfilled]: (state, { payload: { message } }) => {
      return {
        ...state,
        isRegistrationInProgress: false,
        registrationMessage: {
          success: true,
          text: message,
        },
      };
    },
    [registerUser.rejected]: (state, { payload }) => {
      return {
        ...state,
        isRegistrationInProgress: false,
        registrationMessage: {
          success: false,
          text: payload.message ? payload.message : payload,
        },
      };
    },
  },
});

const { reducer: registrationReducer } = registrationSlice;
const { setFormMessage } = registrationSlice.actions;

export { registrationReducer, registerUser, setFormMessage };
