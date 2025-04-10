import { Box, Button, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateCustomerInstitution } from '../../api/customerInstitutionsApi';
import { CategorySelector } from '../../components/CategorySelector';
import { setCustomer } from '../../redux/customerReducer';
import { setNotification } from '../../redux/notificationSlice';
import { RootState } from '../../redux/store';
import { CustomerInstitution } from '../../types/customerInstitution.types';
import { allPublicationInstanceTypes } from '../../types/publicationFieldNames';
import { PublicationInstanceType } from '../../types/registration.types';

export const CategoriesWithFiles = () => {
  const { t } = useTranslation();
  const customer = useSelector((store: RootState) => store.customer);

  return (
    <>
      <Helmet>
        <title>{t('editor.categories_with_files')}</title>
      </Helmet>
      <Typography variant="h1" gutterBottom>
        {t('editor.categories_with_files')}
      </Typography>

      <Typography gutterBottom>{t('editor.categories_with_files_description')}</Typography>

      {customer && <CategoriesWithFilesForCustomer customer={customer} />}
    </>
  );
};

interface CategoriesWithFilesForCustomerProps {
  customer: CustomerInstitution;
}

const CategoriesWithFilesForCustomer = ({ customer }: CategoriesWithFilesForCustomerProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [selectedCategories, setSelectedCategories] = useState(customer.allowFileUploadForTypes);

  const customerMutation = useMutation({
    mutationFn: () => updateCustomerInstitution({ ...customer, allowFileUploadForTypes: selectedCategories }),
    onSuccess: (response) => {
      dispatch(setCustomer(response.data));
      dispatch(setNotification({ message: t('feedback.success.update_customer'), variant: 'success' }));
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_customer'), variant: 'error' })),
  });

  const onSelectType = (registrationType: PublicationInstanceType) => {
    if (selectedCategories.includes(registrationType)) {
      setSelectedCategories(selectedCategories.filter((type) => type !== registrationType));
    } else {
      setSelectedCategories([...selectedCategories, registrationType]);
    }
  };

  const categoriesWithoutFiles =
    selectedCategories.length > 0
      ? allPublicationInstanceTypes.filter((type) => !selectedCategories.includes(type))
      : [];

  return (
    <>
      <CategorySelector
        selectedCategories={selectedCategories}
        onCategoryClick={onSelectType}
        categoriesWithoutFiles={categoriesWithoutFiles}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem', mt: '2rem' }}>
        <Button onClick={() => setSelectedCategories(customer.allowFileUploadForTypes)}>{t('common.cancel')}</Button>
        <Button variant="contained" onClick={() => customerMutation.mutate()} loading={customerMutation.isPending}>
          {t('common.save')}
        </Button>
      </Box>
    </>
  );
};
