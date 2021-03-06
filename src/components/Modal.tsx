import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Avatar, AvatarProps, Backdrop, Dialog, DialogProps, DialogTitle, Fade, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const StyledPaper = styled.div`
  background-color: ${({ theme }) => theme.palette.background};
  margin: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    margin-top: 0;
    min-width: auto;
  }
`;

const StyledHeaderContainer = styled.div`
  display: grid;
  padding-top: 1rem;
  grid-template-areas: 'text cross';
  grid-template-columns: auto 1fr;
  margin-bottom: 1rem;
`;

const StyledHeading = styled(Typography)`
  grid-area: text;
  margin-left: 1rem;
`;

const StyledCloseIcon = styled(CloseIcon)`
  grid-area: cross;
  cursor: pointer;
  margin-right: 1rem;
  justify-self: end;
`;

const StyledAvatar = styled(Avatar)`
  grid-area: avatar;
  margin-left: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: none;
    margin-left: 0;
  }
`;

const StyledInfoContainer = styled.div`
  display: grid;
  grid-template-areas: 'avatar text';
  grid-template-columns: 1fr 7fr;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'text text';
    grid-template-columns: 1fr;
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  grid-area: text;
  padding: 0;
`;

interface ModalProps extends Partial<DialogProps> {
  dataTestId?: string;
  headingIcon?: AvatarProps;
  headingText?: string;
  headingDataTestId?: string;
  onClose?: () => void;
}

export const Modal = ({
  children,
  dataTestId,
  headingIcon,
  headingText,
  headingDataTestId,
  onClose,
  open,
  ...props
}: ModalProps) => {
  const { t } = useTranslation('common');
  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Dialog
      {...props}
      data-testid={dataTestId}
      open={!!open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      onClose={handleClose}
      BackdropProps={{
        timeout: 500,
      }}
      PaperProps={{ 'aria-labelledby': 'titleId' }}>
      <StyledHeaderContainer>
        <StyledDialogTitle disableTypography>
          {headingIcon ? (
            <StyledInfoContainer>
              {headingIcon && <StyledAvatar src={headingIcon.src} alt={headingIcon.alt} />}
              <StyledHeading id="titleId" variant="h3" variantMapping={{ h3: 'h1' }} data-testid={headingDataTestId}>
                {headingText}
              </StyledHeading>
            </StyledInfoContainer>
          ) : (
            <StyledHeading id="titleId" variant="h3" variantMapping={{ h3: 'h1' }} data-testid={headingDataTestId}>
              {headingText}
            </StyledHeading>
          )}
        </StyledDialogTitle>
        <StyledCloseIcon onClick={handleClose} data-testid="close-modal" titleAccess={t('close')} />
      </StyledHeaderContainer>

      <Fade in={open}>
        <StyledPaper>{children}</StyledPaper>
      </Fade>
    </Dialog>
  );
};
