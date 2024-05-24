import { useMutation } from '@tanstack/react-query';
import { getRegistrationByDoi } from '../registrationApi';
import { stringIncludesMathJax, typesetMathJax } from '../../utils/mathJaxHelpers';
import { setNotification } from '../../redux/notificationSlice';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

export const useGetDoiPreview = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (doi: string) => getRegistrationByDoi(doi),
    onSuccess: (response) => {
      if (stringIncludesMathJax(response.entityDescription.mainTitle)) {
        typesetMathJax();
      }
    },
    onError: () => {
      dispatch(setNotification({ message: t('feedback.error.get_doi'), variant: 'error' }));
    },
  });
};
