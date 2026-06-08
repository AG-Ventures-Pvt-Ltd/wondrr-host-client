export const formatDate = (date: Date | string): string => {
  const utcDate = new Date(date);
  const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));
  const month = istDate.toLocaleDateString('en-US', { month: 'short' });
  const day = istDate.getDate();
  const year = istDate.getFullYear();
  return `${month} ${day}, ${year}`;
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
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const nights = diffDays - 1;

  const format = (date: Date) =>
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(date);

  return `${format(start)} - ${format(end)} • ${diffDays}D/${nights}N`;
};