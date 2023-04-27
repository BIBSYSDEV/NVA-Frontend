import { PositionResponse } from '../../types/user.types';

export const mockPositionResponse: PositionResponse = {
  positions: [
    { id: 'https://cristin.no/positions/1', enabled: true, labels: { en: 'Position 1' } },
    { id: 'https://cristin.no/positions/2', enabled: true, labels: { en: 'Position 2' } },
    { id: 'https://cristin.no/positions/3', enabled: true, labels: { en: 'Position 3' } },
  ],
};
