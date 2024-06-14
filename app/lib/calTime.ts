export default function calTime(date: string): string {
  const now = Date.now();
  const created = new Date(date).getTime();
  const msInDay = 1000 * 60 * 60 * 24;
  const diff = Math.round((created - now) / msInDay);

  const formatter = new Intl.RelativeTimeFormat("ko");
  return formatter.format(diff, "days");
}
