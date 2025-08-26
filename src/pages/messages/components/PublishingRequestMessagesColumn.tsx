import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Box, styled, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ExpandedPublishingTicket, PublishingTicket } from '../../../types/publication_types/ticket.types';
import { toDateString } from '../../../utils/date-helpers';
import { LastMessageBox } from './LastMessageBox';

export const StyledMessagesContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
});

export const StyledStatusMessageBox = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: '0.25rem 0.5rem',
  padding: '0.2rem 0.5rem',
  borderRadius: '4px',
  backgroundColor: theme.palette.info.main,
}));

export const StyledIconAndTextWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.2rem',
  color: 'white',
  backgroundColor: theme.palette.info.main,
}));

interface PublishingRequestMessagesColumnProps {
  ticket: ExpandedPublishingTicket | PublishingTicket;
}

export const PublishingRequestMessagesColumn = ({ ticket }: PublishingRequestMessagesColumnProps) => {
  const { t } = useTranslation();

  return (
    <StyledMessagesContainer>
      {ticket.status === 'Pending' || ticket.status === 'New' ? (
        <>
          {ticket.filesForApproval.length > 0 && (
            <StyledStatusMessageBox>
              <StyledIconAndTextWrapper>
                <HourglassEmptyIcon fontSize="small" />
                <Typography sx={{ color: 'inherit' }}>
                  {t('registration.files_and_license.files_awaits_approval', { count: ticket.filesForApproval.length })}
                </Typography>
              </StyledIconAndTextWrapper>
            </StyledStatusMessageBox>
          )}
        </>
      ) : ticket.status === 'Completed' ? (
        <StyledStatusMessageBox>
          <StyledIconAndTextWrapper>
            <CheckIcon fontSize="small" />
            <Typography sx={{ color: 'inherit' }}>
              {ticket.approvedFiles.length
                ? t('my_page.messages.files_published', { count: ticket.approvedFiles.length })
                : t('my_page.messages.metadata_published')}
            </Typography>
          </StyledIconAndTextWrapper>
          {ticket.modifiedDate && <Typography color="white">{toDateString(ticket.modifiedDate)}</Typography>}
        </StyledStatusMessageBox>
      ) : ticket.status === 'Closed' ? (
        <>
          <StyledStatusMessageBox>
            <StyledIconAndTextWrapper>
              <BlockIcon fontSize="small" />
              <Typography>{t('my_page.messages.files_rejected', { count: ticket.filesForApproval.length })}</Typography>
            </StyledIconAndTextWrapper>
            {ticket.modifiedDate && <Typography>{toDateString(ticket.modifiedDate)}</Typography>}
          </StyledStatusMessageBox>
        </>
      ) : null}
      <LastMessageBox ticket={ticket as ExpandedPublishingTicket} />
    </StyledMessagesContainer>
  );
};
