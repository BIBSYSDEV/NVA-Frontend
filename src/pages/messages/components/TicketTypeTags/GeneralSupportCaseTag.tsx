import { useTranslation } from 'react-i18next';
import { Count, TicketTypeTag } from './TicketTypeTag';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

interface GeneralSupportCaseTagProps {
  count?: Count;
}

export const GeneralSupportCaseTag = ({ count }: GeneralSupportCaseTagProps) => {
  const { t } = useTranslation();

  return (
    <TicketTypeTag
      color={'taskType.generalSupportCase.main'}
      count={count}
      text={t('my_page.messages.types.GeneralSupportCase')}
      icon={<ChatBubbleOutlineOutlinedIcon fontSize="small" />}
    />
  );
};
