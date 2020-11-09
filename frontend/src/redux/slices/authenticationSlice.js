import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../common/axios';

const initialState = {
  isAuthenticated: false,
  isAuthenticationInProgress: false,
  authenticationMessage: {
    success: true,
    text: '',
  },
  authorizationToken: '',
  isLogoutInProgress: false,
  logoutMessage: '',
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
      .catch((error) =>
        rejectWithValue(error.response ? error.response.data : error.message)
      );
  }
);

const logoutUser = createAsyncThunk('user/logout', (_, { rejectWithValue }) => {
  return axios
    .post('/api/auth/logout')
    .then(({ data }) => data)
    .catch((error) =>
      rejectWithValue(error.response ? error.response.data : error.message)
    );
});

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setFormMessage: (state, { payload: { success, text } }) => {
      return {
        ...state,
        authenticationMessage: {
          success,
          text,
        },
      };
    },
  },
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
    [authenticateUser.rejected]: (state, { payload }) => {
      return {
        ...state,
        isAuthenticationInProgress: false,
        authenticationMessage: {
          success: false,
          text: payload.message ? payload.message : payload,
        },
      };
    },
    [logoutUser.pending]: (state) => {
      return {
        ...state,
        isLogoutInProgress: true,
      };
    },
    [logoutUser.fulfilled]: (state, { payload: { message } }) => {
      return {
        ...state,
        isLogoutInProgress: false,
        logoutMessage: message,
        isAuthenticated: false,
        authorizationToken: '',
        user: {
          username: '',
          firstName: '',
          lastName: '',
          roles: [],
          privileges: [],
        },
      };
    },
    [logoutUser.rejected]: (state) => {
      return {
        ...state,
        isLogoutInProgress: false,
        logoutMessage: '',
        isAuthenticated: false,
        authorizationToken: '',
        user: {
          username: '',
          firstName: '',
          lastName: '',
          roles: [],
          privileges: [],
        },
      };
    },
  },
});

const { reducer: authenticationReducer } = authenticationSlice;
const { setFormMessage } = authenticationSlice.actions;

export { authenticationReducer, setFormMessage, authenticateUser, logoutUser };
