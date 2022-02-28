import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: apiUrl,
});

axios.defaults.withCredentials = true;
instance.defaults.withCredentials = false;

instance.interceptors.request.use(async (config) => {
  return config;
});

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (
      error &&
      ((error.response && (error.response.status === 401 || error.response.status === 403)) ||
        error.message === 'Network Error') &&
      window.localStorage.getItem('loggedIn')
    ) {
    }
    return Promise.reject(error);
  }
);

export default instance;
