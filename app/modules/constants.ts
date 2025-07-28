export const cycles = [
  { key: 'daily', value: 'Daily' },
  { key: 'weekly', value: 'Weekly' },
  { key: 'biweekly', value: 'Bi-Weekly' },
  { key: 'semimonthly', value: 'Semi-Monthly' },
  { key: 'monthly', value: 'Monthly' },
  { key: 'bimonthly', value: 'Bi-Monthly' },
  { key: 'quarterly', value: 'Quarterly' },
  { key: 'semiannually', value: 'Semi-Annually' },
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

export const payments = [
  { key: 'paid', value: 'Paid' },
  { key: 'pending', value: 'Pending' },
  { key: 'failed', value: 'Failed' },
  { key: 'overdue', value: 'Overdue' },
  { key: 'cancelled', value: 'Cancelled' },
  { key: 'refunded', value: 'Refunded' },
];

export function formatDueDate(dateStr: string): string {
  // Split the input "MM/DD/YYYY" into parts
  const [month, day, year] = dateStr.split('/');

  // Convert to numbers
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);
  const yearNum = parseInt(year, 10);

  // Create a Date object (Note: month is 0-based in JS)
  const dateObj = new Date(yearNum, monthNum - 1, dayNum);

  // Format the date to "Month DD, YYYY"
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default {
  formatDueDate,
  cycles,
  reminders,
  payments
};
