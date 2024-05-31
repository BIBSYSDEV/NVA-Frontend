import AddIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Button, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Modal } from '../../../../components/Modal';
import { OrganizationBox } from '../../../../components/institution/OrganizationBox';
import { SelectInstitutionForm } from '../../../../components/institution/SelectInstitutionForm';
import { UnconfirmedOrganizationBox } from '../../../../components/institution/UnconfirmedOrganizationBox';
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
  const dispatch = useDispatch();
  const { setFieldValue, values } = useFormikContext<Registration>();
  const [openAffiliationModal, setOpenAffiliationModal] = useState(false);
  const [affiliationToVerify, setAffiliationToVerify] = useState('');

  const toggleAffiliationModal = () => setOpenAffiliationModal(!openAffiliationModal);

  const onIdentifyAffiliationClick = (affiliationString: string) => {
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
      dispatch(setNotification({ message: t('registration.contributors.add_duplicate_affiliation'), variant: 'info' }));
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

  const removeAffiliation = (index: number) =>
    setFieldValue(
      `${baseFieldName}.${SpecificContributorFieldNames.Affiliations}`,
      affiliations.filter((_, thisIndex) => thisIndex !== index)
    );

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
          {affiliation.type === 'Organization' && (
            <OrganizationBox
              unitUri={affiliation.id}
              removeAffiliation={() => removeAffiliation(index)}
              sx={{ width: '100%' }}
            />
          )}
          {affiliation.type === 'UnconfirmedOrganization' && (
            <UnconfirmedOrganizationBox
              name={affiliation.name}
              onIdentifyAffiliationClick={onIdentifyAffiliationClick}
              removeAffiliation={() => removeAffiliation(index)}
              sx={{ width: '100%' }}
            />
          )}
        </Box>
      ))}
      <Button
        variant="outlined"
        sx={{ padding: '0.1rem 0.75rem' }}
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
        maxWidth="sm"
        fullWidth={true}
        headingText={t('common.select_institution')}
        dataTestId="affiliation-modal">
        <>
          <Typography paragraph>
            {t('common.name')}: <b>{authorName}</b>
          </Typography>
          {affiliationToVerify && (
            <Typography paragraph>
              {t('registration.contributors.prefilled_affiliation')}: <b>{affiliationToVerify}</b>
            </Typography>
          )}
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
