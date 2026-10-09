import AddIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Box, Button } from '@mui/material';
import { useFormikContext } from 'formik';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OrganizationBox } from '../../../../components/institution/OrganizationBox';
import { UnconfirmedOrganizationBox } from '../../../../components/institution/UnconfirmedOrganizationBox';
import { RegistrationFormContext } from '../../../../context/RegistrationFormContext';
import { Affiliation } from '../../../../types/contributor.types';
import { SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { AddAffiliationModal } from './AddAffiliationModal';

interface AffiliationsCellProps {
  affiliations?: Affiliation[];
  authorName: string;
  baseFieldName: string;
}

export const AffiliationsCell = ({ affiliations = [], authorName, baseFieldName }: AffiliationsCellProps) => {
  const { t } = useTranslation();
  const { setFieldValue } = useFormikContext<Registration>();
  const [openAffiliationModal, setOpenAffiliationModal] = useState(false);
  const [affiliationToVerify, setAffiliationToVerify] = useState('');

  const { disableNviCriticalFields, disableChannelClaimsFields } = useContext(RegistrationFormContext);
  const disabled = disableNviCriticalFields || disableChannelClaimsFields;

  const toggleAffiliationModal = () => setOpenAffiliationModal(!openAffiliationModal);

  const onIdentifyAffiliationClick = (affiliationString: string) => {
    setAffiliationToVerify(affiliationString);
    toggleAffiliationModal();
  };

  // Show each organization only once, even if the contributor has duplicate affiliations
  const affiliationsToShow = affiliations
    .map((affiliation, index) => ({ affiliation, index }))
    .filter(
      ({ affiliation, index }) =>
        affiliation.type !== 'Organization' ||
        affiliations.findIndex((a) => a.type === 'Organization' && a.id === affiliation.id) === index
    );

  const removeAffiliation = (index: number) => {
    const affiliationToRemove = affiliations[index];
    setFieldValue(
      `${baseFieldName}.${SpecificContributorFieldNames.Affiliations}`,
      affiliations.filter(
        (affiliation, thisIndex) =>
          thisIndex !== index &&
          !(
            affiliationToRemove.type === 'Organization' &&
            affiliation.type === 'Organization' &&
            affiliation.id === affiliationToRemove.id
          )
      )
    );
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
      {affiliationsToShow.map(({ affiliation, index }) => (
        <Box
          key={`org-${index}`}
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
              authorName={authorName}
              affiliations={affiliations}
              baseFieldName={baseFieldName}
              removeAffiliation={disabled ? undefined : () => removeAffiliation(index)}
              sx={{ width: '100%' }}
              canEdit={!disabled}
            />
          )}
          {affiliation.type === 'UnconfirmedOrganization' && (
            <UnconfirmedOrganizationBox
              name={affiliation.name}
              onIdentifyAffiliationClick={disabled ? undefined : onIdentifyAffiliationClick}
              removeAffiliation={() => removeAffiliation(index)}
              sx={{ width: '100%' }}
            />
          )}
        </Box>
      ))}
      <Button
        disabled={disabled}
        color="tertiary"
        variant="contained"
        sx={{ padding: '0.1rem 0.75rem' }}
        data-testid={dataTestId.registrationWizard.contributors.addAffiliationButton}
        startIcon={<AddIcon />}
        onClick={toggleAffiliationModal}>
        {t('registration.contributors.add_affiliation')}
      </Button>
      <AddAffiliationModal
        openAffiliationModal={openAffiliationModal}
        affiliationToVerify={affiliationToVerify}
        setAffiliationToVerify={setAffiliationToVerify}
        toggleAffiliationModal={toggleAffiliationModal}
        authorName={authorName}
        affiliations={affiliations}
        baseFieldName={baseFieldName}
      />
    </Box>
  );
};
