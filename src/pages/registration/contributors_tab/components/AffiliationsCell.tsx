import AddIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Button } from '@mui/material';
import { useFormikContext } from 'formik';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OrganizationBox } from '../../../../components/institution/OrganizationBox';
import { UnconfirmedOrganizationBox } from '../../../../components/institution/UnconfirmedOrganizationBox';
import { NviCandidateContext } from '../../../../context/NviCandidateContext';
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

  const { disableNviCriticalFields } = useContext(NviCandidateContext);

  const toggleAffiliationModal = () => setOpenAffiliationModal(!openAffiliationModal);

  const onIdentifyAffiliationClick = (affiliationString: string) => {
    setAffiliationToVerify(affiliationString);
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
              authorName={authorName}
              affiliations={affiliations}
              baseFieldName={baseFieldName}
              removeAffiliation={disableNviCriticalFields ? undefined : () => removeAffiliation(index)}
              sx={{ width: '100%' }}
              canEdit={!disableNviCriticalFields}
            />
          )}
          {affiliation.type === 'UnconfirmedOrganization' && (
            <UnconfirmedOrganizationBox
              name={affiliation.name}
              onIdentifyAffiliationClick={disableNviCriticalFields ? undefined : onIdentifyAffiliationClick}
              removeAffiliation={() => removeAffiliation(index)}
              sx={{ width: '100%' }}
            />
          )}
        </Box>
      ))}
      <Button
        disabled={disableNviCriticalFields}
        variant="outlined"
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
