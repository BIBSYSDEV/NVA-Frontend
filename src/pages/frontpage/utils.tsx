import { SearchParam } from '../../utils/searchHelpers';
import { ResultParam } from '../../api/searchApi';
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

export const getUrlParams = (searchParam: SearchParam | ResultParam, value: string) => {
  const searchParams = new URLSearchParams();
  searchParams.set(searchParam, value);
  return searchParams.toString();
};

export const selectCategoryIcon = (type: PublicationType, iconStyle = {}) => {
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
