import { LoadingButton } from '@mui/lab';
import { Box, Button, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { apiRequest } from '../../../../api/apiRequest';
import { ContributorSearchField } from '../../../../components/ContributorSearchField';
import { StyledContributorModalActions } from '../../../../components/styled/Wrappers';
import { setNotification } from '../../../../redux/notificationSlice';
import { RootState } from '../../../../redux/store';
import { ContributorRole } from '../../../../types/contributor.types';
import { Registration } from '../../../../types/registration.types';
import { CristinPerson } from '../../../../types/user.types';
import { isErrorStatus, isSuccessStatus } from '../../../../utils/constants';
import { dataTestId } from '../../../../utils/dataTestIds';

interface AddContributorFormProps {
  addContributor: (selectedUser: CristinPerson) => void;
  openAddUnverifiedContributor: () => void;
  initialSearchTerm?: string;
  roleToAdd: ContributorRole;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const AddContributorForm = ({
  addContributor,
  openAddUnverifiedContributor,
  initialSearchTerm,
  searchTerm,
  setSearchTerm,
}: AddContributorFormProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);

  const [isAddingSelf, setIsAddingSelf] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<CristinPerson>();

  const { values } = useFormikContext<Registration>();
  const contributors = values.entityDescription?.contributors ?? [];

  const isSelfAdded = user?.cristinId && contributors.some((contributor) => contributor.identity.id === user.cristinId);

  const addSelfAsContributor = async () => {
    if (user?.cristinId) {
      setIsAddingSelf(true);
      const getCurrentPersonResponse = await apiRequest<CristinPerson>({ url: user.cristinId });
      if (isErrorStatus(getCurrentPersonResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.add_contributor'), variant: 'error' }));
      } else if (isSuccessStatus(getCurrentPersonResponse.status)) {
        addContributor(getCurrentPersonResponse.data);
      }
      setIsAddingSelf(false);
    }
  };

  return (
    <>
      {initialSearchTerm && (
        <Typography variant="subtitle1">
          {t('registration.contributors.prefilled_name')}: <b>{initialSearchTerm}</b>
        </Typography>
      )}
      <ContributorSearchField
        selectedPerson={selectedPerson}
        setSelectedPerson={setSelectedPerson}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <StyledContributorModalActions sx={{ gridTemplateColumns: { md: '1fr', lg: '1fr 1fr 1fr' } }}>
        {!initialSearchTerm && (
          <Button
            data-testid={dataTestId.registrationWizard.contributors.addUnverifiedContributorButton}
            variant="outlined"
            onClick={openAddUnverifiedContributor}>
            {t('registration.contributors.add_new_contributor')}
          </Button>
        )}
        {!isSelfAdded && !initialSearchTerm && (
          <Box sx={{ display: 'flex', justifyContent: { lg: 'center' } }}>
            <LoadingButton
              data-testid={dataTestId.registrationWizard.contributors.addSelfButton}
              onClick={addSelfAsContributor}
              variant="outlined"
              loading={isAddingSelf}>
              {t('project.add_self')}
            </LoadingButton>
          </Box>
        )}
        <Button
          data-testid={dataTestId.registrationWizard.contributors.selectUserButton}
          disabled={!selectedPerson}
          onClick={() => selectedPerson && addContributor(selectedPerson)}
          size="large"
          variant="contained">
          {initialSearchTerm
            ? t('registration.contributors.verify_contributor')
            : t('registration.contributors.add_contributor')}
        </Button>
      </StyledContributorModalActions>
    </>
  );
};
