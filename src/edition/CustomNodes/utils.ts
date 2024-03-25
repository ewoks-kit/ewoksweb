export function formatId(id: string): string {
  if (id.length <= 20) {
    return id;
  }

  return id.split('.').pop() as string;
}
