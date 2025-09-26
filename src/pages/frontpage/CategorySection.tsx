import { Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { TypeCard } from './TypeCard';
import { FrontPageBox } from './styles';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { registrationRows } from '../../components/CategorySelector';
import { HorizontalBox } from '../../components/styled/Wrappers';
import { PublicationType } from '../../types/publicationFieldNames';
import { ResultParam } from '../../api/searchApi';
import { getUrlParams, selectCategoryIcon } from './utils';
import { dataTestId } from '../../utils/dataTestIds';

export const CategorySection = () => {
  const { t } = useTranslation();

  return (
    <FrontPageBox sx={{ bgcolor: 'white', alignItems: 'center', gap: '0.75rem' }}>
      <Trans
        t={t}
        i18nKey="science_categories_front_page"
        components={{
          heading: <Typography variant="h2" sx={{ fontSize: '1.5rem', color: '#120732' }} />,
          p: <Typography sx={{ color: '#120732', textAlign: 'center' }} />,
        }}
      />
      <HorizontalBox sx={{ flexWrap: 'wrap', justifyContent: 'center', width: '100%', mt: '1rem', gap: '1rem' }}>
        {registrationRows.map((mainCategory) => {
          const searchParams = mainCategory.registrationTypes ? mainCategory.registrationTypes.join(',') : '';

          return (
            <TypeCard
              key={mainCategory.mainType}
              text={
                mainCategory.mainType === PublicationType.GeographicalContent
                  ? t(
                      'registration.publication_types.Map'
                    ) /* UI design decision to have the title of this category be "Map" on the front page */
                  : t(`registration.publication_types.${mainCategory.mainType}`)
              }
              icon={selectCategoryIcon(mainCategory.mainType)}
              dataTestId={dataTestId.frontPage.frontpageCategory[mainCategory.mainType]}
              to={{
                pathname: UrlPathTemplate.Search,
                search: getUrlParams(ResultParam.CategoryShould, searchParams),
              }}
              sx={{
                width: { xs: '47%', sm: '31%', md: '23%', lg: '18%' },
                borderRadius: '0.5rem',
              }}
            />
          );
        })}
      </HorizontalBox>
    </FrontPageBox>
  );
};
