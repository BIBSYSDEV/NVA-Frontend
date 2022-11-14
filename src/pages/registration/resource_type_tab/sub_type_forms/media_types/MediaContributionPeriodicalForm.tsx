import { JournalField } from '../../components/JournalField';
import { PublicationChannelType } from '../../../../../types/registration.types';
import { JournalDetailsFields } from '../../components/JournalDetailsFields';

export const MediaContributionPeriodicalForm = () => (
  <>
    <JournalField
      confirmedContextType={PublicationChannelType.MediaContributionPeriodical}
      unconfirmedContextType={PublicationChannelType.UnconfirmedMediaContributionPeriodical}
    />

    <JournalDetailsFields />
  </>
);
