import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { InstitutionUnitBase } from '../../types/institution.types';
import { RootStore } from '../../redux/reducers/rootReducer';
import { useFetch } from './useFetch';
import { getPreferredLanguageCode } from '../translation-helpers';
import { setInstitutions } from '../../redux/actions/institutionActions';
import { InstitutionApiPath } from '../../api/apiPaths';

// This hook is used to fetch all top-level institutions and put them in Redux, to avoid fetching same data many times
export const useFetchInstitutions = (): [InstitutionUnitBase[], boolean] => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('feedback');
  const institutionsState = useSelector((store: RootStore) => store.institutions);

  const shouldFetchInstitutions = institutionsState.items.length === 0 || institutionsState.language !== i18n.language;

  const [institutions, isLoading] = useFetch<InstitutionUnitBase[]>({
    url: shouldFetchInstitutions ? `${InstitutionApiPath.Institutions}?language=${getPreferredLanguageCode()}` : '',
    errorMessage: t('error.get_institutions'),
  });

  useEffect(() => {
    if (institutions && institutions.length > 0) {
      dispatch(setInstitutions(institutions));
    }
  }, [dispatch, institutions]);

  return [institutionsState.items, isLoading];
};
