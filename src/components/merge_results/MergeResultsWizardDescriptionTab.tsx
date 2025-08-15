import { TextField, Typography } from '@mui/material';
import { useContext } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Registration } from '../../types/registration.types';
import { BackgroundDiv } from '../styled/Wrappers';
import { CompareFields } from './CompareFields';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';

interface MergeResultsWizardDescriptionTabProps {
  register: UseFormRegister<Registration>;
  setValue: UseFormSetValue<Registration>;
}

export const MergeResultsWizardDescriptionTab = ({ register, setValue }: MergeResultsWizardDescriptionTabProps) => {
  const { t } = useTranslation();
  const { sourceResult, targetResult } = useContext(MergeResultsWizardContext);

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
            {...register('entityDescription.mainTitle')}
          />
        }
        isMatching={sourceResult.entityDescription?.mainTitle === targetResult.entityDescription?.mainTitle}
        onCopyValue={() => setValue('entityDescription.mainTitle', sourceResult.entityDescription?.mainTitle ?? '')}
      />
    </BackgroundDiv>
  );
};
