import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateCustomerInstitution } from '../../api/customerInstitutionsApi';
import { CategorySelector } from '../../components/CategorySelector';
import { setNotification } from '../../redux/notificationSlice';
import { RootState } from '../../redux/store';
import { PublicationInstanceType } from '../../types/registration.types';

export const CategoriesWithFiles = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const customer = useSelector((store: RootState) => store.customer);

  const [selectedCategories, setSelectedCategories] = useState(customer?.allowFileUploadForTypes ?? []);
  useEffect(() => {
    setSelectedCategories(customer?.allowFileUploadForTypes ?? []);
  }, [customer]);

  const customerMutation = useMutation({
    mutationFn: customer
      ? () => updateCustomerInstitution({ ...customer, allowFileUploadForTypes: selectedCategories })
      : undefined,
    onSuccess: () => dispatch(setNotification({ message: t('feedback.success.update_customer'), variant: 'success' })),
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_customer'), variant: 'error' })),
  });

  const onSelectType = (registrationType: PublicationInstanceType) => {
    if (selectedCategories.includes(registrationType)) {
      setSelectedCategories(selectedCategories.filter((type) => type !== registrationType));
    } else {
      setSelectedCategories([...selectedCategories, registrationType]);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('editor.categories_with_files')}</title>
      </Helmet>
      <Typography variant="h2" gutterBottom>
        {t('editor.categories_with_files')}
      </Typography>

      <Typography sx={{ my: '2rem' }}>{t('editor.categories_with_files_description')}</Typography>

      <CategorySelector selectedCategories={selectedCategories} onCategoryClick={onSelectType} />

      <LoadingButton
        variant="contained"
        sx={{ mt: '2rem' }}
        onClick={() => customerMutation.mutate()}
        loading={customerMutation.isLoading}>
        {t('common.save')}
      </LoadingButton>
    </>
  );
};
