import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { Box, FormControlLabel, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPerson } from '../../../api/cristinApi';
import { BackgroundDiv, StyledStatusCheckbox } from '../../../components/styled/Wrappers';
import { setNotification } from '../../../redux/notificationSlice';
import { RootState } from '../../../redux/store';
import { ResearchProfilePanel } from './ResearchProfilePanel';

export const MyPageMyFieldAndBackground = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const personId = useSelector((store: RootState) => store.user?.cristinId) ?? '';

  const personQuery = useQuery({
    queryKey: [personId],
    queryFn: () => fetchPerson(personId),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_person'), variant: 'error' })),
  });
  const person = personQuery.data;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: '3fr 1fr',
        },
        columnGap: '1rem',
        gridTemplateAreas: {
          xs: '"field-and-background" "research-profile"',
          md: '"user-profile research-profile" ',
        },
      }}>
      <BackgroundDiv
        sx={{
          bgcolor: 'info.light',
        }}>
        <Typography variant="h2">{t('my_page.my_profile.background')}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '1rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <StarOutlineIcon />
            <Typography variant="h3">{t('my_page.my_profile.norwegian')}</Typography>
            <FormControlLabel
              disabled
              sx={{ ml: '1rem' }}
              control={<StyledStatusCheckbox />}
              label={'Vises offemtlig'}
            />
          </Box>
          <TextField variant="filled" multiline rows="3" placeholder="Skriv inn"></TextField>
          <Typography sx={{ alignSelf: 'end' }}>0/200</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '1rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <StarOutlineIcon />
            <Typography variant="h3">{t('my_page.my_profile.english')}</Typography>
            <FormControlLabel
              disabled
              sx={{ ml: '1rem' }}
              control={<StyledStatusCheckbox />}
              label={'Vises offemtlig'}
            />
          </Box>
          <TextField variant="filled" multiline rows="3" placeholder="Skriv inn"></TextField>
          <Typography sx={{ alignSelf: 'end' }}>0/200</Typography>
        </Box>
      </BackgroundDiv>
      <Box sx={{ gridArea: 'research-profile' }}>
        <ResearchProfilePanel person={person} isLoadingPerson={personQuery.isLoading} />
      </Box>
    </Box>
  );
};
