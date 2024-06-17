import { Location } from 'history';
import { BasicDataLocationState } from '../types/locationState.types';
import { UrlPathTemplate } from './urlPaths';

export const getBackPath = (location: Location<BasicDataLocationState>) =>
  location.state?.previousPath
    ? {
        pathname: location.state.previousPath,
        state: { previousSearch: location.state.previousSearch },
      }
    : {
        pathname: UrlPathTemplate.BasicDataCentralImport,
        search: location.state?.previousSearch,
      };
