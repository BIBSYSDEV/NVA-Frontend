import { useTranslation } from 'react-i18next';
import { Count, TicketTypeTag } from './TicketTypeTag';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

interface PublishingRequestTagProps {
  count?: Count;
}

export const PublishingRequestTag = ({ count }: PublishingRequestTagProps) => {
  const { t } = useTranslation();

  return (
    <TicketTypeTag
      color={'taskType.publishingRequest.main'}
      count={count}
      text={t('my_page.messages.types.PublishingRequest')}
      icon={<InsertDriveFileOutlinedIcon fontSize="small" />}
    />
  );
};
