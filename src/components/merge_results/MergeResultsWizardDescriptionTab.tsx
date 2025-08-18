import { TextField, Typography } from '@mui/material';
import { useContext } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAutoResizeTextFieldMultiline } from '../../utils/hooks/useAutoResizeTextFieldMultiline';
import { BackgroundDiv } from '../styled/Wrappers';
import { CompareFields } from './CompareFields';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';

export const MergeResultsWizardDescriptionTab = () => {
  const { t } = useTranslation();
  const { sourceResult, formMethods } = useContext(MergeResultsWizardContext);

  const mainTitleValue = useWatch({ name: 'entityDescription.mainTitle', control: formMethods.control });
  const [mainTitleRef, resizeMainTitle] = useAutoResizeTextFieldMultiline();

  return (
    <BackgroundDiv
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 10rem 1fr',
        gap: '0.5rem',
        mt: '2rem',
        alignItems: 'center',
      }}>
      <Typography variant="h2">Importkandidat</Typography>
      <span />
      <Typography variant="h2">Publisert resultat</Typography>

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
            inputRef={mainTitleRef}
            {...formMethods.register('entityDescription.mainTitle')}
          />
        }
        isMatching={sourceResult.entityDescription?.mainTitle === mainTitleValue}
        isChanged={mainTitleValue !== formMethods.formState.defaultValues?.entityDescription?.mainTitle}
        onCopyValue={() => {
          formMethods.setValue('entityDescription.mainTitle', sourceResult.entityDescription?.mainTitle ?? '');
          resizeMainTitle();
        }}
        onResetValue={() => {
          formMethods.resetField('entityDescription.mainTitle');
          resizeMainTitle();
        }}
      />
    </BackgroundDiv>
  );
};
