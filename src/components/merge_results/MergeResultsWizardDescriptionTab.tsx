import { TextField, Typography } from '@mui/material';
import { useContext, useRef } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BackgroundDiv } from '../styled/Wrappers';
import { CompareFields } from './CompareFields';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';

export const MergeResultsWizardDescriptionTab = () => {
  const { t } = useTranslation();
  const { sourceResult, formMethods } = useContext(MergeResultsWizardContext);

  const mainTitleValue = useWatch({ name: 'entityDescription.mainTitle', control: formMethods.control });

  const ref = useRef<HTMLTextAreaElement>(null);

  return (
    <BackgroundDiv
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 10rem 1fr',
        gap: '0.5rem',
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
            inputRef={ref}
            {...formMethods.register('entityDescription.mainTitle')}
          />
        }
        isMatching={sourceResult.entityDescription?.mainTitle === mainTitleValue}
        onCopyValue={() => {
          formMethods.setValue('entityDescription.mainTitle', sourceResult.entityDescription?.mainTitle ?? '');
          if (ref.current) {
            ref.current.style.height = 'auto';
            ref.current.style.height = `${ref.current.scrollHeight}px`;
          }
        }}
        onResetValue={() => {
          formMethods.resetField('entityDescription.mainTitle');
          if (ref.current) {
            ref.current.style.height = 'auto';
            ref.current.style.height = `${ref.current.scrollHeight}px`;
          }
        }}
      />
    </BackgroundDiv>
  );
};
