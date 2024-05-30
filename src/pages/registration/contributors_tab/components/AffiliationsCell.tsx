import AddIcon from '@mui/icons-material/AddCircle';
import RemoveIcon from '@mui/icons-material/HighlightOff';
import WarningIcon from '@mui/icons-material/Warning';
import { Box, Button, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { OrganizationTree } from '../../../../components/institution/OrganizationTree';
import { SelectInstitutionForm } from '../../../../components/institution/SelectInstitutionForm';
import { Modal } from '../../../../components/Modal';
import { setNotification } from '../../../../redux/notificationSlice';
import { Affiliation } from '../../../../types/contributor.types';
import { SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getDistinctContributorUnits } from '../../../../utils/institutions-helpers';

interface AffiliationsCellProps {
  affiliations?: Affiliation[];
  authorName: string;
  baseFieldName: string;
}

export const AffiliationsCell = ({ affiliations = [], authorName, baseFieldName }: AffiliationsCellProps) => {
  const { t } = useTranslation();
  const disptach = useDispatch();
  const { setFieldValue, values } = useFormikContext<Registration>();
  const [openAffiliationModal, setOpenAffiliationModal] = useState(false);
  const [affiliationToVerify, setAffiliationToVerify] = useState('');
  const toggleAffiliationModal = () => setOpenAffiliationModal(!openAffiliationModal);

  const verifyAffiliationOnClick = (affiliationString: string) => {
    setAffiliationToVerify(affiliationString);
    toggleAffiliationModal();
  };

  const addAffiliation = (newAffiliationId: string) => {
    if (!newAffiliationId) {
      return;
    }

    // Avoid adding same unit twice
    if (
      affiliations.some((affiliation) => affiliation.type === 'Organization' && affiliation.id === newAffiliationId)
    ) {
      disptach(setNotification({ message: t('registration.contributors.add_duplicate_affiliation'), variant: 'info' }));
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
    <Box
      sx={{
        gridArea: 'affiliation',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: '0.75rem',
      }}>
      {affiliations.map((affiliation, index) => (
        <Box
          key={affiliation.type === 'Organization' ? affiliation.id : `org-${index}`}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            width: '100%',
            gap: '0.25rem',
          }}>
          {affiliation.type === 'Organization' && <OrganizationTree unitUri={affiliation.id} sx={{ width: '100%' }} />}
          {affiliation.type === 'UnconfirmedOrganization' && (
            <>
              <Typography>"{affiliation.name}"</Typography>
              <Button
                variant="outlined"
                sx={{ textTransform: 'none' }}
                data-testid={dataTestId.registrationWizard.contributors.verifyAffiliationButton}
                startIcon={<WarningIcon color="warning" />}
                onClick={() => affiliation.name && verifyAffiliationOnClick(affiliation.name)}>
                {t('registration.contributors.verify_affiliation')}
              </Button>
            </>
          )}

          <Button
            color="primary"
            size="small"
            data-testid={dataTestId.registrationWizard.contributors.removeAffiliationButton}
            onClick={() =>
              setFieldValue(
                `${baseFieldName}.${SpecificContributorFieldNames.Affiliations}`,
                affiliations.filter((_, thisIndex) => thisIndex !== index)
              )
            }
            startIcon={<RemoveIcon />}>
            {t('registration.contributors.remove_affiliation')}
          </Button>
        </Box>
      ))}
      <Button
        size="medium"
        data-testid={dataTestId.registrationWizard.contributors.addAffiliationButton}
        startIcon={<AddIcon />}
        onClick={toggleAffiliationModal}>
        {t('registration.contributors.add_affiliation')}
      </Button>

      {/* Modal for adding affiliation */}
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
        <>
          <Trans
            i18nKey="registration.contributors.add_new_affiliation_helper_text"
            components={[<Typography paragraph />]}
          />
          <Box
            sx={{
              bgcolor: 'secondary.main',
              borderRadius: '0.25rem',
              padding: '0.5rem 0.75rem',
              marginBottom: '2rem',
            }}>
            {' '}
            <Typography>
              {t('common.contributor')}: <b>{authorName}</b>
            </Typography>
          </Box>
          {affiliationToVerify && (
            <Typography paragraph>
              {t('registration.contributors.prefilled_affiliation')}: <b>{affiliationToVerify}</b>
            </Typography>
          )}
          <Typography variant="h3" component="h2" sx={{ marginBottom: '1rem', fontWeight: 'normal' }}>
            {t('common.select_institution')}
          </Typography>
          <SelectInstitutionForm
            onSubmit={addAffiliation}
            onClose={toggleAffiliationModal}
            suggestedInstitutions={getDistinctContributorUnits(values.entityDescription?.contributors ?? []).filter(
              (suggestion) =>
                !affiliations.some(
                  (affiliation) => affiliation.type === 'Organization' && affiliation.id === suggestion
                )
            )}
          />
        </>
      </Modal>
    </Box>
  );
};
