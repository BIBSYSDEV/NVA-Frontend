import { Box } from '@mui/material';
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';
import { BetaFunctionality } from '../../components/BetaFunctionality';
import { dataTestId } from '../../utils/dataTestIds';

interface ShareOptionsProps {
  title: string;
  description: string;
}

export const ShareOptions = ({ title, description }: ShareOptionsProps) => {
  const url = window.location.href;

  return (
    <BetaFunctionality>
      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
        <EmailShareButton
          url={url}
          subject={title}
          body={`${description}\n\n`}
          data-testid={dataTestId.registrationLandingPage.emailButton}>
          <EmailIcon size={32} round />
        </EmailShareButton>
        <LinkedinShareButton
          url={url}
          title={title}
          summary={description}
          data-testid={dataTestId.registrationLandingPage.linkedInButton}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
        <FacebookShareButton url={url} quote={title} data-testid={dataTestId.registrationLandingPage.facebookButton}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton url={url} title={title} data-testid={dataTestId.registrationLandingPage.twitterButton}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      </Box>
    </BetaFunctionality>
  );
};
