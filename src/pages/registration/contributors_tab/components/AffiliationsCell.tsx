import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/AddCircleOutlineSharp';
import RemoveIcon from '@mui/icons-material/HighlightOff';
import WarningIcon from '@mui/icons-material/Warning';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { Modal } from '../../../../components/Modal';
import { setNotification } from '../../../../redux/notificationSlice';
import { Institution } from '../../../../types/contributor.types';
import { SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { SelectInstitutionForm } from '../../../../components/institution/SelectInstitutionForm';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getDistinctContributorUnits } from '../../../../utils/institutions-helpers';

interface AffiliationsCellProps {
  affiliations?: Institution[];
  authorName: string;
  baseFieldName: string;
}

export const AffiliationsCell = ({ affiliations = [], authorName, baseFieldName }: AffiliationsCellProps) => {
  const { t } = useTranslation();
  const disptach = useDispatch();
  const { setFieldValue, values } = useFormikContext<Registration>();
  const [openAffiliationModal, setOpenAffiliationModal] = useState(false);
  const [affiliationToRemove, setAffiliationToRemove] = useState<Institution | null>(null);
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
    if (affiliations.some((affiliation) => affiliation.id === newAffiliationId)) {
      disptach(setNotification({ message: t('registration.contributors.add_duplicate_affiliation'), variant: 'info' }));
      return;
    }

    const addedAffiliation: Institution = {
      type: 'Organization',
      id: newAffiliationId,
    };

    let updatedAffiliations = [...affiliations]; // Must spread affiliations in order to keep changes when switching tab
    if (affiliationToVerify) {
      // Verify affiliation
      const affiliationIndex = updatedAffiliations.findIndex(
        (affiliation) => affiliation.labels && getLanguageString(affiliation.labels) === affiliationToVerify
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
        gap: '0.5rem',
      }}>
      {affiliations.map((affiliation, index) => (
        <Box
          key={affiliation.id ?? index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
          {affiliation.id ? (
            <AffiliationHierarchy unitUri={affiliation.id} />
          ) : (
            affiliation.labels && (
              <>
                <Typography>"{getLanguageString(affiliation.labels)}"</Typography>
                <Tooltip title={t('registration.contributors.verify_affiliation')}>
                  <IconButton
                    data-testid={dataTestId.registrationWizard.contributors.verifyAffiliationButton}
                    onClick={() =>
                      affiliation.labels && verifyAffiliationOnClick(getLanguageString(affiliation.labels))
                    }>
                    <WarningIcon color="warning" />
                  </IconButton>
                </Tooltip>
              </>
            )
          )}
          <Tooltip title={t('registration.contributors.remove_affiliation')}>
            <IconButton
              color="error"
              size="small"
              data-testid={dataTestId.registrationWizard.contributors.removeAffiliationButton}
              onClick={() => setAffiliationToRemove(affiliation)}>
              <RemoveIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ))}
      <Button
        size="small"
        data-testid={dataTestId.registrationWizard.contributors.addAffiliationButton}
        startIcon={<AddIcon />}
        onClick={toggleAffiliationModal}
        sx={{
          gridArea: 'add-affiliation',
          justifyContent: 'flex-start',
        }}>
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
            <Typography>
              {t('registration.contributors.prefilled_affiliation')}: <b>{affiliationToVerify}</b>
            </Typography>
          )}
          <SelectInstitutionForm
            onSubmit={addAffiliation}
            onClose={toggleAffiliationModal}
            suggestedInstitutions={getDistinctContributorUnits(values.entityDescription?.contributors ?? []).filter(
              (suggestion) => !affiliations.some((affiliation) => affiliation.id === suggestion)
            )}
          />
        </>
      </Modal>

      {/* Confirm dialog for removing affiliation */}
      <ConfirmDialog
        open={!!affiliationToRemove}
        title={t('registration.contributors.confirm_remove_affiliation_title')}
        onAccept={() => {
          setFieldValue(
            `${baseFieldName}.${SpecificContributorFieldNames.Affiliations}`,
            affiliations.filter((affiliation) => affiliation.id !== affiliationToRemove?.id)
          );
          setAffiliationToRemove(null);
        }}
        onCancel={() => setAffiliationToRemove(null)}
        dialogDataTestId="confirm-remove-affiliation-dialog">
        <Typography>{t('registration.contributors.confirm_remove_affiliation_text')}</Typography>
      </ConfirmDialog>
    </Box>
  );
};
