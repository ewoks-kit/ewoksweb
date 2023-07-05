export function formatDate(dateTimeString: string): string {
  const dateTime = new Date(dateTimeString);

  return `${dateTime.toString()}`;
}
