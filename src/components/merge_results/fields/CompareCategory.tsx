import WarningIcon from '@mui/icons-material/Warning';
import { Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { PublicationType } from '../../../types/publicationFieldNames';
import { PublicationInstanceType, Registration } from '../../../types/registration.types';
import { StyledInfoBanner } from '../../styled/Wrappers';
import { CompareFields } from './CompareFields';
import { SourceValue } from './SourceValue';

interface CompareCategoryProps {
  sourceInstanceType: PublicationInstanceType | '';
  targetInstanceType: PublicationInstanceType | '';
  sourceMainType: PublicationType | '';
  targetMainType: PublicationType | '';
}

export const CompareCategory = ({
  sourceInstanceType,
  targetInstanceType,
  sourceMainType,
  targetMainType,
}: CompareCategoryProps) => {
  const { t } = useTranslation();
  const { formState, setValue } = useFormContext<Registration>();

  const targetInitialInstanceType =
    formState.defaultValues?.entityDescription?.reference?.publicationInstance?.type ?? '';
  const isSameMainCategory = sourceMainType === targetMainType;

  return (
    <>
      {!isSameMainCategory && (
        <StyledInfoBanner sx={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <WarningIcon />
          <div>
            <Trans
              t={t}
              i18nKey="cannot_copy_category_from_another_context_type"
              components={{ p: <Typography color="inherit" /> }}
            />
          </div>
        </StyledInfoBanner>
      )}

      <CompareFields
        sourceContent={
          <SourceValue
            label={t('common.category')}
            value={
              <>
                {sourceInstanceType && t(`registration.publication_types.${sourceInstanceType}`)}
                {!isSameMainCategory && sourceMainType && <MainTypeContent type={sourceMainType} />}
              </>
            }
          />
        }
        targetContent={
          <SourceValue
            label={t('common.category')}
            value={
              <>
                {targetInstanceType && t(`registration.publication_types.${targetInstanceType}`)}
                {!isSameMainCategory && targetMainType && <MainTypeContent type={targetMainType} />}
              </>
            }
          />
        }
        isMatching={sourceInstanceType === targetInstanceType}
        isChanged={targetInitialInstanceType !== targetInstanceType}
        onCopyValue={
          sourceInstanceType && isSameMainCategory
            ? () => setValue('entityDescription.reference.publicationInstance.type', sourceInstanceType)
            : undefined
        }
        onResetValue={() => setValue('entityDescription.reference.publicationInstance.type', targetInitialInstanceType)}
      />
    </>
  );
};

interface MainTypeContent {
  type: PublicationType;
}

const MainTypeContent = ({ type }: MainTypeContent) => {
  const { t } = useTranslation();
  return <span style={{ marginLeft: '0.25rem' }}>({t(`registration.publication_types.${type}`)})</span>;
};
