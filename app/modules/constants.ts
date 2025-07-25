export const cycles = [
  { key: 'daily', value: 'Daily' },
  { key: 'weekly', value: 'Weekly' },
  { key: 'biweekly', value: 'Bi-Weekly' },
  // { key: 'semimonthly', value: 'Semi-Monthly' },
  { key: 'monthly', value: 'Monthly' },
  { key: 'bimonthly', value: 'Bi-Monthly' },
  { key: 'quarterly', value: 'Quarterly' },
  // { key: 'semiannually', value: 'Semi-Annually' },
  { key: 'yearly', value: 'Yearly' },
];

export const reminders = [
  { key: 'none', value: 'No Reminder' },
  // { key: 'same_day', value: 'On Due Date' },
  { key: '1_day_before', value: '1 Day Before' },
  { key: '2_day_before', value: '2 Days Before' },
  { key: '3_day_before', value: '3 Days Before' },
  { key: '5_day_before', value: '5 Days Before' },
  { key: '1_week_before', value: '1 Week Before' },
  { key: '2_week_before', value: '2 Weeks Before' },
];

export default {
  cycles,
  reminders,
};
