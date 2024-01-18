import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { DegreeRegistration } from '../../../../../types/publication_types/degreeRegistration.types';
import { UnconfirmedDocument } from '../../../../../types/publication_types/researchDataRegistration.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { PublisherField } from '../../components/PublisherField';
import { SearchRelatedResultField } from '../../components/SearchRelatedResultField';
import { SeriesFields } from '../../components/SeriesFields';
import { IsbnAndPages } from '../../components/isbn_and_pages/IsbnAndPages';

export const PhdForm = () => {
  const { t } = useTranslation();
  const { values } = useFormikContext<DegreeRegistration>();

  const unconfirmedRelated = (values.entityDescription.reference?.publicationInstance.related?.filter(
    (r) => r.type === 'UnconfirmedDocument'
  ) ?? []) as UnconfirmedDocument[];

  return (
    <>
      <PublisherField />

      <IsbnAndPages />
      <SeriesFields />

      <Typography variant="h2">{t('registration.resource_type.related_result')}</Typography>
      <SearchRelatedResultField />

      {unconfirmedRelated?.map((relation, index) => (
        <Box key={relation.text} sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <TextField variant="filled" multiline value={relation.text} fullWidth />
          <Button
            size="small"
            variant="outlined"
            color="error"
            data-testid={dataTestId.registrationWizard.resourceType.removeRelationButton(index.toString())}
            // onClick={() => setConfirmRemoveRelation(true)}
            startIcon={<RemoveCircleOutlineIcon />}>
            {t('registration.resource_type.research_data.remove_relation')}
          </Button>
        </Box>
      ))}
    </>
  );
};
