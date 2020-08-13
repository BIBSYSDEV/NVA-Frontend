import Axios from 'axios';
import { API_URL } from './constants';

export const setAxiosDefaults = () => {
  Axios.defaults.baseURL = API_URL;
  Axios.defaults.headers.common = {
    Accept: 'application/json',
  };
  Axios.defaults.headers.post['Content-Type'] = 'application/json';
  Axios.defaults.headers.put['Content-Type'] = 'application/json';
};
