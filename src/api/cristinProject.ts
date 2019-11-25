import Axios from 'axios';
import { ApiBaseUrl, StatusCode } from '../utils/constants';

export const searchCristinProjects = async (query: string) => {
  try {
    const response = await Axios.get(`${ApiBaseUrl.CRISTIN_EXTERNAL}/projects?${query}`);
    if (response.status === StatusCode.OK) {
      if (response.headers) response.data.totalCont = response.headers['X-Total-Count'];
      return response.data;
    } else {
      console.error('error.get_cristin_project'); //TO BE REPLACED
    }
  } catch (err) {
    console.error('error.get_cristin_project', err); //TO BE REPLACED
  }
};
