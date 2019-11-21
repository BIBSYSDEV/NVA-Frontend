import Axios from 'axios';
import { ApiBaseUrl, StatusCode } from '../utils/constants';

export const getCristinProjects = async (query: string) => {
  try {
    const response = await Axios.get(`${ApiBaseUrl.CRISTIN_EXTERNAL}/?title=${query}&per_page=10`);
    console.log(response);
    if (response.status === StatusCode.OK) {
      //totalt antall i X-Total-Count i header
      return response.data;
    } else {
      console.error('error.get_cristin_project'); //TO BE REPLACED
    }
  } catch (err) {
    console.error('error.get_cristin_project', err); //TO BE REPLACED
  }
};

// export const lookupDoiTitle = async (url: string) => {
//   try {
//     const response = await Axios.get(`/${ApiBaseUrl.DOI_LOOKUP}${url}`);
//     if (response.status === StatusCode.OK) {
//       return response.data.title;
//     } else {
//       console.error('error.get_doi'); //TO BE REPLACED
//     }
//   } catch {
//     console.error('error.get_doi'); //TO BE REPLACED
//   }
// };
