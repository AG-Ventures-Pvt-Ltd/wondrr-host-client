const IST_LOCALE_DATE = (d: Date) =>
  d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // "YYYY-MM-DD"

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  const [year, month, day] = IST_LOCALE_DATE(d).split('-').map(Number);
  const localMidnight = new Date(year, month - 1, day);
  const monthStr = localMidnight.toLocaleDateString('en-US', { month: 'short' });
  return `${monthStr} ${day}, ${year}`;
};

export const formatDateTime = (date: Date | string): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata'
  });
};

export const formatDateRangeWithDuration = (startDate: string, endDate: string): string => {
  const parseIST = (s: string) => {
    const [y, m, d] = new Date(s).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }).split('-').map(Number);
    return new Date(y, m - 1, d);
  };
  const start = parseIST(startDate);
  const end = parseIST(endDate);
  const diffDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  const nights = diffDays - 1;
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  return `${fmt(start)} - ${fmt(end)} • ${diffDays}D/${nights}N`;
};