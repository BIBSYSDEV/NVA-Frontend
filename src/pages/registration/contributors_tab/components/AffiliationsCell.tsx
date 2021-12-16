import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button, IconButton, Theme, Tooltip, Typography, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/AddCircleOutlineSharp';
import RemoveIcon from '@mui/icons-material/HighlightOff';
import WarningIcon from '@mui/icons-material/Warning';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { AddInstitution } from '../../../../components/institution/AddInstitution';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { Modal } from '../../../../components/Modal';
import { setNotification } from '../../../../redux/actions/notificationActions';
import { Institution } from '../../../../types/contributor.types';
import { FormikInstitutionUnit } from '../../../../types/institution.types';
import { NotificationVariant } from '../../../../types/notification.types';
import { SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';
import { getMostSpecificUnit } from '../../../../utils/institutions-helpers';
import { getLanguageString } from '../../../../utils/translation-helpers';

const StyledAffiliationsCell = styled.div`
  grid-area: affiliation;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StyledCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledAddAffiliationButton = styled(Button)`
  grid-area: add-affiliation;
  display: flex;
  justify-content: flex-start;
`;

interface AffiliationsCellProps {
  affiliations?: Institution[];
  authorName: string;
  baseFieldName: string;
}

export const AffiliationsCell = ({ affiliations, authorName, baseFieldName }: AffiliationsCellProps) => {
  const { t } = useTranslation('registration');
  const disptach = useDispatch();
  const { setFieldValue } = useFormikContext<Registration>();
  const [openAffiliationModal, setOpenAffiliationModal] = useState(false);
  const [affiliationToRemove, setAffiliationToRemove] = useState<Institution | null>(null);
  const [affiliationToVerify, setAffiliationToVerify] = useState('');
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const toggleAffiliationModal = () => setOpenAffiliationModal(!openAffiliationModal);

  const verifyAffiliationOnClick = (affiliationString: string) => {
    setAffiliationToVerify(affiliationString);
    toggleAffiliationModal();
  };

  const addAffiliation = (value: FormikInstitutionUnit) => {
    if (!value.unit) {
      return;
    }

    const mostSpecificUnit = getMostSpecificUnit(value.unit);

    // Avoid adding same unit twice
    if (affiliations?.some((affiliation) => affiliation.id === mostSpecificUnit.id)) {
      disptach(setNotification(t('contributors.add_duplicate_affiliation'), NotificationVariant.Info));
      return;
    }

    const addedAffiliation: Institution = {
      type: 'Organization',
      id: mostSpecificUnit.id,
    };

    let updatedAffiliations = affiliations ? [...affiliations] : []; // Must spread affiliations in order to keep changes when switching tab
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
    <StyledAffiliationsCell>
      {affiliations?.map((affiliation, index) => (
        <StyledCard key={affiliation.id ?? index}>
          {affiliation.id ? (
            <AffiliationHierarchy unitUri={affiliation.id} />
          ) : (
            affiliation.labels && (
              <>
                <Typography>"{getLanguageString(affiliation.labels)}"</Typography>
                <Button
                  startIcon={<WarningIcon />}
                  variant="outlined"
                  data-testid="button-set-unverified-affiliation"
                  onClick={() => affiliation.labels && verifyAffiliationOnClick(getLanguageString(affiliation.labels))}>
                  {t('contributors.verify_affiliation')}
                </Button>
              </>
            )
          )}
          <Tooltip title={t<string>('contributors.remove_affiliation')}>
            <IconButton
              color="error"
              size="small"
              data-testid={`button-remove-affiliation-${affiliation.id}`}
              onClick={() => setAffiliationToRemove(affiliation)}>
              <RemoveIcon />
            </IconButton>
          </Tooltip>
        </StyledCard>
      ))}
      <StyledAddAffiliationButton
        size="small"
        data-testid="button-add-affiliation"
        startIcon={<AddIcon />}
        onClick={toggleAffiliationModal}>
        {t('contributors.add_affiliation')}
      </StyledAddAffiliationButton>

      {/* Modal for adding affiliation */}
      <Modal
        open={openAffiliationModal}
        onClose={() => {
          setAffiliationToVerify('');
          toggleAffiliationModal();
        }}
        maxWidth="sm"
        fullWidth={isMobile}
        headingText={t('contributors.select_institution')}
        dataTestId="affiliation-modal">
        <>
          <Typography paragraph>
            {t('common:name')}: <b>{authorName}</b>
          </Typography>
          {affiliationToVerify && (
            <Typography>
              {t('contributors.prefilled_affiliation')}: <b>{affiliationToVerify}</b>
            </Typography>
          )}
          <AddInstitution onClose={toggleAffiliationModal} onSubmit={addAffiliation} />
        </>
      </Modal>

      {/* Confirm dialog for removing affiliation */}
      <ConfirmDialog
        open={!!affiliationToRemove}
        title={t('contributors.confirm_remove_affiliation_title')}
        onAccept={() => {
          if (affiliations) {
            setFieldValue(
              `${baseFieldName}.${SpecificContributorFieldNames.Affiliations}`,
              affiliations.filter((affiliation) => affiliation.id !== affiliationToRemove?.id)
            );
          }
          setAffiliationToRemove(null);
        }}
        onCancel={() => setAffiliationToRemove(null)}
        dataTestId="confirm-remove-affiliation-dialog">
        <Typography>{t('contributors.confirm_remove_affiliation_text')}</Typography>
      </ConfirmDialog>
    </StyledAffiliationsCell>
  );
};
