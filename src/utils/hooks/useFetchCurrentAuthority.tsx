import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthority, addQualifierIdForAuthority, AuthorityQualifiers } from '../../api/authorityApi';
import { setNotification } from '../../redux/actions/notificationActions';
import { setAuthorityData, setPossibleAuthorities } from '../../redux/actions/userActions';
import { RootStore } from '../../redux/reducers/rootReducer';
import { Authority } from '../../types/authority.types';
import { NotificationVariant } from '../../types/notification.types';
import useFetchAuthorities from './useFetchAuthorities';

const useFetchCurrentAuthority = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('feedback');
  const user = useSelector((store: RootStore) => store.user);
  const [matchingAuthorities] = useFetchAuthorities(user?.name ?? '');

  useEffect(() => {
    if (matchingAuthorities && user && !user.authority && !user.possibleAuthorities) {
      const fetchAuthority = async () => {
        const filteredAuthorities = matchingAuthorities.filter((auth) => auth.feideids.some((id) => id === user.id));
        if (filteredAuthorities.length === 1) {
          // Use exsisting authority
          const existingScn = filteredAuthorities[0].systemControlNumber;
          const existingAuthority = await getAuthority(existingScn);
          if (existingAuthority?.error) {
            dispatch(setNotification(t('error.get_authority'), NotificationVariant.Error));
          } else if (existingAuthority?.data) {
            let currentAuthority = existingAuthority.data;
            if (user.cristinId && !existingAuthority.data.orgunitids.includes(user.cristinId)) {
              // Add cristinId to Authority's orgunitids
              const authorityWithOrgId = await addQualifierIdForAuthority(
                existingScn,
                AuthorityQualifiers.ORGUNIT_ID,
                user.cristinId
              );
              if (authorityWithOrgId?.error) {
                dispatch(setNotification(authorityWithOrgId.error, NotificationVariant.Error));
              } else {
                currentAuthority = authorityWithOrgId as Authority;
              }
            }
            dispatch(setAuthorityData(currentAuthority));
          }
        } else {
          dispatch(setPossibleAuthorities(matchingAuthorities));
        }
      };
      fetchAuthority();
    }
  }, [dispatch, t, matchingAuthorities, user]);
};

export default useFetchCurrentAuthority;
