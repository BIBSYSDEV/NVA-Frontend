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
import styled from 'styled-components';
import { BetaFunctionality } from '../../components/BetaFunctionality';

const StyledShareContainer = styled.div`
  display: flex;
  > :not(:last-child) {
    margin-right: 0.5rem;
  }
`;

interface ShareOptionsProps {
  title: string;
  description: string;
}

export const ShareOptions = ({ title, description }: ShareOptionsProps) => {
  const url = window.location.href;

  return (
    <BetaFunctionality>
      <StyledShareContainer>
        <EmailShareButton url={url} subject={title} body={`${description}\n\n`}>
          <EmailIcon size={32} round />
        </EmailShareButton>
        <LinkedinShareButton url={url} title={title} summary={description}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
        <FacebookShareButton url={url} quote={title}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton url={url} title={title}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      </StyledShareContainer>
    </BetaFunctionality>
  );
};
