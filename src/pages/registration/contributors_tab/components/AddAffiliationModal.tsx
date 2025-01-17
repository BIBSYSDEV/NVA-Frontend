import { Box, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { SelectInstitutionForm } from '../../../../components/institution/SelectInstitutionForm';
import { Modal } from '../../../../components/Modal';
import { setNotification } from '../../../../redux/notificationSlice';
import { Affiliation } from '../../../../types/contributor.types';
import { SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';
import { getDistinctContributorUnits } from '../../../../utils/institutions-helpers';

interface AddAffiliationModalProps {
  openAffiliationModal: boolean;
  setAffiliationToVerify: (val: string) => void;
  toggleAffiliationModal: () => void;
  authorName: string;
  affiliationToVerify: string;
  affiliations?: Affiliation[];
  baseFieldName: string;
}

export const AddAffiliationModal = ({
  openAffiliationModal,
  setAffiliationToVerify,
  toggleAffiliationModal,
  affiliationToVerify,
  authorName,
  affiliations = [],
  baseFieldName,
}: AddAffiliationModalProps) => {
  const { t } = useTranslation();
  const { setFieldValue, values } = useFormikContext<Registration>();
  const dispatch = useDispatch();

  const addAffiliation = (newAffiliationId: string) => {
    if (!newAffiliationId) {
      return;
    }

    // Avoid adding same unit twice
    if (
      affiliations.some((affiliation) => affiliation.type === 'Organization' && affiliation.id === newAffiliationId)
    ) {
      dispatch(setNotification({ message: t('common.contributors.add_duplicate_affiliation'), variant: 'info' }));
      return;
    }

    const addedAffiliation: Affiliation = {
      type: 'Organization',
      id: newAffiliationId,
    };

    let updatedAffiliations = [...affiliations]; // Must spread affiliations in order to keep changes when switching tab

    if (affiliationToVerify) {
      // Verify affiliation
      const affiliationIndex = updatedAffiliations.findIndex(
        (affiliation) => affiliation.type === 'UnconfirmedOrganization' && affiliation.name === affiliationToVerify
      );
      updatedAffiliations[affiliationIndex] = addedAffiliation;
    } else {
      // Add new affiliation
      if (updatedAffiliations) {
        updatedAffiliations.push(addedAffiliation);
      } else {
        updatedAffiliations = [addedAffiliation];
      }
    }

    setFieldValue(`${baseFieldName}.${SpecificContributorFieldNames.Affiliations}`, updatedAffiliations);
    toggleAffiliationModal();
  };

  return (
    <Modal
      open={openAffiliationModal}
      onClose={() => {
        setAffiliationToVerify('');
        toggleAffiliationModal();
      }}
      maxWidth="md"
      fullWidth={true}
      headingText={t('registration.contributors.add_new_affiliation')}
      dataTestId="affiliation-modal">
      <Trans
        i18nKey="registration.contributors.add_new_affiliation_helper_text"
        components={[<Typography sx={{ mb: '1rem' }} key="1" />]}
      />
      <Box
        sx={{
          bgcolor: 'secondary.main',
          borderRadius: '0.25rem',
          padding: '0.5rem 0.75rem',
          marginBottom: '2rem',
        }}>
        <Typography>
          {t('common.contributor')}: <b>{authorName}</b>
        </Typography>
      </Box>
      {affiliationToVerify && (
        <Typography sx={{ mb: '1rem' }}>
          {t('registration.contributors.prefilled_affiliation')}: <b>{affiliationToVerify}</b>
        </Typography>
      )}
      <SelectInstitutionForm
        saveAffiliation={addAffiliation}
        onCancel={toggleAffiliationModal}
        suggestedInstitutions={getDistinctContributorUnits(values.entityDescription?.contributors ?? []).filter(
          (suggestion) =>
            !affiliations.some((affiliation) => affiliation.type === 'Organization' && affiliation.id === suggestion)
        )}
      />
    </Modal>
  );
};
