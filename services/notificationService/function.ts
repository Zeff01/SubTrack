
/** Convert dates to human readable one */
export function parseDate(dateStr: string): Date {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return new Date(NaN);
    const month = parseInt(parts[0], 10) - 1; // JS months start at 0
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
}

/** Calculate the day before the reminder.
 * Tnis convert the value "reminders" to a number
 */
export function reminderToDays(remind_me: string): number | null {
    if (remind_me === 'none') return null;
    const dayMatch = remind_me.match(/^(\d+)_day_before$/);
    if (dayMatch) return parseInt(dayMatch[1], 10);
    const weekMatch = remind_me.match(/^(\d+)_week_before$/);
    if (weekMatch) return parseInt(weekMatch[1], 10) * 7;
    return null;
}
