export function formatDate(dateTimeString: string): string {
  const dateTime = new Date(dateTimeString);

  const year = dateTime.getFullYear();
  const month = dateTime.toLocaleString('default', { month: 'long' });
  const day = dateTime.getDate();
  const hour = dateTime.getHours();
  const minute = dateTime.getMinutes();
  // const second = dateTime.getSeconds();

  return `${month} ${day}, ${year} at ${hour}:${minute}`;
}
