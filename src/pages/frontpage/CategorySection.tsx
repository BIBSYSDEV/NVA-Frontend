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

export const CategorySection = () => {
  const { t } = useTranslation();
  const iconStyle = { height: '2rem', width: '2rem', color: '#120732' };

  return (
    <FrontPageBox sx={{ bgcolor: 'white', alignItems: 'center' }}>
      <Trans
        t={t}
        i18nKey="science_categories_front_page"
        components={{
          heading: <Typography variant="h2" sx={{ fontSize: '1.5rem', color: '#120732' }} />,
          p: <Typography sx={{ color: '#120732' }} />,
        }}
      />
      <HorizontalBox sx={{ flexWrap: 'wrap', justifyContent: 'center', width: '100%', mt: '1rem', gap: '1rem' }}>
        {registrationRows.map((category) => {
          const searchParams = category.registrationTypes ? category.registrationTypes.join(',') : '';
          return (
            <TypeCard
              key={t(`registration.publication_types.${category.mainType}`)}
              text={
                category.mainType === PublicationType.GeographicalContent
                  ? t(
                      `front_page_category_map`
                    ) /* UI design decision to have the title of this category be "Map" on the front page */
                  : t(`registration.publication_types.${category.mainType}`)
              }
              icon={selectCategoryIcon(category.mainType, iconStyle)}
              dataTestId={`category-advanced-search-${category.mainType}`}
              to={{
                pathname: UrlPathTemplate.Search,
                search: getUrlParams(ResultParam.CategoryShould, searchParams),
              }}
              sx={{ width: { xs: '100%', sm: '15rem' }, borderRadius: '0.5rem' }}
            />
          );
        })}
      </HorizontalBox>
    </FrontPageBox>
  );
};
