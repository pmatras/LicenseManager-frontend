const AUTH_TOKEN_KEY = 'authorization_token';

const getPersistedToken = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token !== null && token !== '' ? token : '';
};

const persistToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

const purgePersistedToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export { getPersistedToken, persistToken, purgePersistedToken };
