import Axios from 'axios';
import { ApiBaseUrl, StatusCode } from '../utils/constants';

export const getCristinProject = async (query: string) => {
  try {
    const response = await Axios.get(`${ApiBaseUrl.CRISTIN_EXTERNAL}/?title=${query}&per_page=10`);
    if (response.status === StatusCode.OK) {
      //totalt antall i X-Total-Count i header
      return response.data;
    } else {
      console.error('error.get_cristin_project'); //TO BE REPLACED
    }
  } catch {
    console.error('error.get_cristin_project'); //TO BE REPLACED
  }
};
