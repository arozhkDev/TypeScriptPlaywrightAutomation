export function extractNumber(input: string): number {
  const regex = /[\d.]+/g;
  const matches = input.match(regex);

  return Number(matches?.join('')) || 0;
}

export function formatNumber(number: number): string {
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
