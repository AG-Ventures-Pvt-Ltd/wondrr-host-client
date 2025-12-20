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
  const startUtc = new Date(startDate);
  const endUtc = new Date(endDate);
  const start = new Date(startUtc.getTime() + (5.5 * 60 * 60 * 1000));
  const end = new Date(endUtc.getTime() + (5.5 * 60 * 60 * 1000));
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive days
  const nights = diffDays - 1;
  const formattedStart = `${start.toLocaleDateString('en-US', { month: 'short' })} ${start.getDate()}, ${start.getFullYear()}`;
  const formattedEnd = `${end.toLocaleDateString('en-US', { month: 'short' })} ${end.getDate()}, ${end.getFullYear()}`;
  return `${formattedStart} - ${formattedEnd} • ${diffDays}D/${nights}N`;
};