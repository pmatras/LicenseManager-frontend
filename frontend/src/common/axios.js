import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const axiosInstance = axios.create({
  baseURL: SERVER_URL,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

export default axiosInstance;
