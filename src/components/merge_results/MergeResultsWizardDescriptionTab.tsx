import { TextField, Typography } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BackgroundDiv } from '../styled/Wrappers';
import { CompareFields } from './CompareFields';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';

export const MergeResultsWizardDescriptionTab = () => {
  const { t } = useTranslation();
  const { sourceResult, targetResult, formMethods } = useContext(MergeResultsWizardContext);

  return (
    <BackgroundDiv
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: '1rem',
        mt: '2rem',
        alignItems: 'center',
      }}>
      <Typography variant="h3">Importkandidat</Typography>
      <span />
      <Typography variant="h3">Publisert resultat</Typography>

      <CompareFields
        sourceContent={
          <TextField
            variant="filled"
            label={t('common.title')}
            multiline
            value={sourceResult.entityDescription?.mainTitle}
            disabled
          />
        }
        targetContent={
          <TextField
            variant="filled"
            label={t('common.title')}
            multiline
            {...formMethods.register('entityDescription.mainTitle')}
          />
        }
        isMatching={sourceResult.entityDescription?.mainTitle === targetResult.entityDescription?.mainTitle}
        onCopyValue={() =>
          formMethods.setValue('entityDescription.mainTitle', sourceResult.entityDescription?.mainTitle ?? '')
        }
      />
    </BackgroundDiv>
  );
};
