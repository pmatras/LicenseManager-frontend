import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../common/axios';

const initialState = {
  isAuthenticated: false,
  isAuthenticationInProgress: false,
  authenticationMessage: {
    succcess: true,
    text: '',
  },
  authorizationToken: '',
  user: {
    username: '',
    firstName: '',
    lastName: '',
    roles: [],
    privileges: [],
  },
};

const authenticateUser = createAsyncThunk(
  'user/authenticate',
  (credentials, { rejectWithValue }) => {
    return axios
      .post('/api/auth/login', credentials)
      .then((response) => response.data)
      .catch((error) => rejectWithValue(error.response.data));
  }
);

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  extraReducers: {
    [authenticateUser.pending]: (state) => {
      return {
        ...state,
        isAuthenticationInProgress: true,
      };
    },
    [authenticateUser.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        isAuthenticationInProgress: false,
        isAuthenticated: true,
        ...payload,
      };
    },
    [authenticateUser.rejected]: (state, { payload: { message } }) => {
      return {
        ...state,
        isAuthenticationInProgress: false,
        authenticationMessage: {
          success: false,
          text: message,
        },
      };
    },
  },
});

const { reducer: authenticationReducer } = authenticationSlice;

export { authenticationReducer, authenticateUser };
