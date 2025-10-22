import { useTranslation } from 'react-i18next';
import { Count, TicketTypeTag } from './TicketTypeTag';
import AddLinkOutlinedIcon from '@mui/icons-material/AddLinkOutlined';

interface DoiRequestTagProps {
  count?: Count;
}

export const DoiRequestTag = ({ count }: DoiRequestTagProps) => {
  const { t } = useTranslation();

  return (
    <TicketTypeTag
      color={'taskType.doiRequest.main'}
      count={count}
      text={t('my_page.messages.types.DoiRequest')}
      icon={<AddLinkOutlinedIcon fontSize="small" />}
    />
  );
};
