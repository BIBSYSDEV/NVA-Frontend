import { useTranslation } from 'react-i18next';
import { TicketType, TicketTypeEnum } from '../../types/publication_types/ticket.types';

export const useTicketTypeText = (ticketType: TicketType) => {
  const { t } = useTranslation();

  switch (ticketType) {
    case TicketTypeEnum.PublishingRequest:
      return t('my_page.messages.types.PublishingRequest');
    case TicketTypeEnum.DoiRequest:
      return t('my_page.messages.types.DoiRequest');
    case TicketTypeEnum.GeneralSupportCase:
      return t('my_page.messages.types.GeneralSupportCase');
    case TicketTypeEnum.FilesApprovalThesis:
      return t('my_page.messages.types.FilesApprovalThesis');
    case TicketTypeEnum.UnpublishRequest:
    default:
      return '';
  }
};
