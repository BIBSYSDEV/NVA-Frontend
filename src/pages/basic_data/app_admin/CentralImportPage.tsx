import { List, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ResultItem } from './CentralImportResultItem';

const mockPublication = {
  title: 'The Title',
  description: 'The Description',
  type: 'Article',
  doi: 'https://doi.org/10.1038/s41467-021-25342423',
  contributors: ['Peder Botten', 'Gregor Garbrielsen', 'Oddny Osteloff'],
  institution: 'The Institution',
  confirmedContributors: '0 of 2',
};

const mockPublicationList = [
  mockPublication,
  mockPublication,
  mockPublication,
  mockPublication,
  mockPublication,
  mockPublication,
];

export const CentralImportPage = () => {
  const { t } = useTranslation('basicData');
  return (
    <>
      <Typography variant="h3" component="h2" paragraph>
        {t('publications')}
      </Typography>
      <List>
        {mockPublicationList.map((publication, index) => (
          <ResultItem publication={publication} key={index} />
        ))}
      </List>
    </>
  );
};
