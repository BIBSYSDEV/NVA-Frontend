import { Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { TypeCard } from './TypeCard';
import { FrontPageBox } from './styles';
import { SearchTypeValue } from '../search/SearchTypeDropdown';
import { SearchParam } from '../../utils/searchHelpers';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { registrationRows } from '../../components/CategorySelector';
import { HorizontalBox } from '../../components/styled/Wrappers';
import { PublicationType } from '../../types/publicationFieldNames';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import InsertChartOutlinedOutlinedIcon from '@mui/icons-material/InsertChartOutlinedOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import TheaterComedyOutlinedIcon from '@mui/icons-material/TheaterComedyOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import CoPresentOutlinedIcon from '@mui/icons-material/CoPresentOutlined';

const selectCategoryIcon = (type: PublicationType) => {
  const iconStyle = { height: '2rem', width: '2rem', color: '#120732' };

  switch (type) {
    case PublicationType.PublicationInJournal:
      return <FeedOutlinedIcon sx={iconStyle} />;
    case PublicationType.Book:
      return <ClassOutlinedIcon sx={iconStyle} />;
    case PublicationType.Report:
      return <InsertChartOutlinedOutlinedIcon sx={iconStyle} />;
    case PublicationType.Degree:
      return <SchoolOutlinedIcon sx={iconStyle} />;
    case PublicationType.Anthology:
      return <MenuBookOutlinedIcon sx={iconStyle} />;
    case PublicationType.Presentation:
      return <CoPresentOutlinedIcon sx={iconStyle} />;
    case PublicationType.Artistic:
      return <ColorLensOutlinedIcon sx={iconStyle} />;
    case PublicationType.MediaContribution:
      return <MicNoneOutlinedIcon sx={iconStyle} />;
    case PublicationType.ResearchData:
      return <StorageOutlinedIcon sx={iconStyle} />;
    case PublicationType.ExhibitionContent:
      return <TheaterComedyOutlinedIcon sx={iconStyle} />;
    case PublicationType.GeographicalContent:
    default:
      return <MapOutlinedIcon sx={iconStyle} />;
  }
};

const getUrlParams = (type: SearchTypeValue) => {
  const searchParams = new URLSearchParams();
  searchParams.set(SearchParam.Type, type);
  return searchParams.toString();
};

export const CategorySection = () => {
  const { t } = useTranslation();

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
          console.log('category', category);
          console.log('datatestid', `categoryLink-${category.mainType.replace(/\s/g, '-')}`);
          return (
            <TypeCard
              key={t(`registration.publication_types.${category.mainType.replace(/\s/g, '_')}`)}
              text={t(`registration.publication_types.${category.mainType}`)}
              icon={selectCategoryIcon(category.mainType)}
              dataTestId={`categoryLink-${category.mainType}`}
              to={{ pathname: UrlPathTemplate.Search, search: getUrlParams(SearchTypeValue.Project) }}
              sx={{ width: '15rem', borderRadius: '0.5rem' }}
            />
          );
        })}
      </HorizontalBox>
    </FrontPageBox>
  );
};
