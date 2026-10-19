import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link as MuiLink,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KbsAssessmentAnswer } from '../kbs.types';

// TODO: Replace with the real URL to the KBS reporting guide
const kbsReportingGuideUrl = '#';

const answerLabelId = 'kbs-assessment-answer-label';

interface KbsAssessmentFormProps {
  savedAnswer?: KbsAssessmentAnswer;
  onSave: (answer: KbsAssessmentAnswer) => void;
}

export const KbsAssessmentForm = ({ savedAnswer, onSave }: KbsAssessmentFormProps) => {
  const { t } = useTranslation();
  const [answer, setAnswer] = useState<KbsAssessmentAnswer | null>(savedAnswer ?? null);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
        <Typography>{t('kbs_requirement_question')}</Typography>
        <MuiLink
          href={kbsReportingGuideUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {t('kbs_reporting_guide')}
          <OpenInNewIcon fontSize="small" />
        </MuiLink>
      </Box>

      <FormControl>
        <FormLabel id={answerLabelId}>{t('choose_between')}</FormLabel>
        <RadioGroup
          aria-labelledby={answerLabelId}
          value={answer ?? ''}
          onChange={(event) => setAnswer(event.target.value as KbsAssessmentAnswer)}>
          <FormControlLabel value={KbsAssessmentAnswer.No} control={<Radio />} label={t('common.no')} />
          <FormControlLabel
            value={KbsAssessmentAnswer.YesButInclusionsNotThisYear}
            control={<Radio />}
            label={t('kbs_yes_but_inclusions_not_this_year')}
          />
          <FormControlLabel value={KbsAssessmentAnswer.Yes} control={<Radio />} label={t('common.yes')} />
        </RadioGroup>
      </FormControl>

      <Button
        variant="contained"
        color="secondary"
        disabled={!answer}
        onClick={() => answer && onSave(answer)}
        sx={{ alignSelf: 'center' }}>
        {t('common.save')}
      </Button>
    </Box>
  );
};
