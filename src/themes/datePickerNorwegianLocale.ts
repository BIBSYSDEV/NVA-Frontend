// TODO: Use translations from MUI when they are part of the package -> https://github.com/mui/mui-x/pull/5475

import { PickersLocaleText, CalendarPickerView } from '@mui/x-date-pickers';

export const nbNOPickersLocale: Partial<PickersLocaleText<any>> = {
  // Calendar navigation
  previousMonth: 'Forrige måned',
  nextMonth: 'Neste måned',

  // View navigation
  openPreviousView: 'åpne forrige visning',
  openNextView: 'åpne neste visning',
  calendarViewSwitchingButtonAriaLabel: (view: CalendarPickerView) =>
    view === 'year' ? 'årsvisning er åpen, bytt til kalendervisning' : 'kalendervisning er åpen, bytt til årsvisning',

  // DateRange placeholders
  start: 'Start',
  end: 'Slutt',

  // Action bar
  cancelButtonLabel: 'Avbryt',
  clearButtonLabel: 'Fjern',
  okButtonLabel: 'OK',
  todayButtonLabel: 'I dag',

  // Clock labels
  clockLabelText: (view, time, adapter) =>
    `Velg ${view}. ${time === null ? 'Ingen tid valgt' : `Valgt tid er ${adapter.format(time, 'fullTime')}`}`,
  hoursClockNumberText: (hours) => `${hours} timer`,
  minutesClockNumberText: (minutes) => `${minutes} minutter`,
  secondsClockNumberText: (seconds) => `${seconds} sekunder`,

  // Open picker labels
  openDatePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Velg dato, valgt dato er ${utils.format(utils.date(rawValue)!, 'fullDate')}` // eslint-disable-line
      : 'Velg dato',
  openTimePickerDialogue: (rawValue, utils) =>
    rawValue && utils.isValid(utils.date(rawValue))
      ? `Velg tid, valgt tid er ${utils.format(utils.date(rawValue)!, 'fullTime')}` // eslint-disable-line
      : 'Velg tid',

  // Table labels
  timeTableLabel: 'velg tid',
  dateTableLabel: 'velg dato',
};
