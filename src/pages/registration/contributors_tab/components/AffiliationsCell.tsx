import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircleOutlineSharp';
import DeleteIcon from '@material-ui/icons/RemoveCircleSharp';
import WarningIcon from '@material-ui/icons/Warning';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { DangerButton } from '../../../../components/DangerButton';
import { AddInstitution } from '../../../../components/institution/AddInstitution';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { Modal } from '../../../../components/Modal';
import { setNotification } from '../../../../redux/actions/notificationActions';
import { Institution } from '../../../../types/contributor.types';
import { FormikInstitutionUnit } from '../../../../types/institution.types';
import { NotificationVariant } from '../../../../types/notification.types';
import { BackendTypeNames } from '../../../../types/publication_types/commonRegistration.types';
import { SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';
import { useIsMobile } from '../../../../utils/hooks/useIsMobile';
import { getMostSpecificUnit } from '../../../../utils/institutions-helpers';
import { getLanguageString } from '../../../../utils/translation-helpers';

const StyledAffiliationsCell = styled.div`
  grid-area: affiliation;
`;

const StyledCard = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  &:first-of-type {
    border-top: 1px solid ${({ theme }) => theme.palette.divider};
  }
`;

const StyledAddAffiliationButton = styled(Button)`
  grid-area: add-affiliation;
  display: flex;
  justify-content: flex-start;
  margin-top: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin: 1rem 0;
  }
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
  const isMobile = useIsMobile();
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
      type: BackendTypeNames.ORGANIZATION,
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

    setFieldValue(`${baseFieldName}.${SpecificContributorFieldNames.AFFILIATIONS}`, updatedAffiliations);
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
                  color="primary"
                  startIcon={<WarningIcon />}
                  variant="outlined"
                  data-testid="button-set-unverified-affiliation"
                  onClick={() => affiliation.labels && verifyAffiliationOnClick(getLanguageString(affiliation.labels))}>
                  {t('contributors.verify_affiliation')}
                </Button>
              </>
            )
          )}
          <DangerButton
            size="small"
            data-testid={`button-remove-affiliation-${affiliation.id}`}
            startIcon={<DeleteIcon />}
            onClick={() => setAffiliationToRemove(affiliation)}>
            {t('contributors.remove_affiliation')}
          </DangerButton>
        </StyledCard>
      ))}
      <StyledAddAffiliationButton
        size="small"
        color="primary"
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
          <Typography>
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
              `${baseFieldName}.${SpecificContributorFieldNames.AFFILIATIONS}`,
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
