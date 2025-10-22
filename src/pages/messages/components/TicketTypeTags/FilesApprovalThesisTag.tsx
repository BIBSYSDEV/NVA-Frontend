import { useTranslation } from 'react-i18next';
import { Count, TicketTypeTag } from './TicketTypeTag';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';

interface FilesApprovalThesisTagProps {
  count?: Count;
}

export const FilesApprovalThesisTag = ({ count }: FilesApprovalThesisTagProps) => {
  const { t } = useTranslation();

  return (
    <TicketTypeTag
      color={'taskType.filesApprovalThesis.main'}
      count={count}
      text={t('my_page.messages.types.FilesApprovalThesis')}
      icon={<SchoolOutlinedIcon fontSize="small" />}
    />
  );
};
