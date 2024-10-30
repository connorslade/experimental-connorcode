export function mean(data: number[]): number | null {
  if (data.length === 0) return null;

  const sorted_data = [...data].sort((a, b) => a - b);

  const q1 = sorted_data[Math.floor(sorted_data.length / 4)];
  const q3 = sorted_data[Math.floor((sorted_data.length * 3) / 4)];
  const iqr = q3 - q1;

  const lower_bound = q1 - 1.5 * iqr;
  const upper_bound = q3 + 1.5 * iqr;

  const filtered_data = sorted_data.filter(
    (value) => value >= lower_bound && value <= upper_bound
  );

  const sum = filtered_data.reduce((acc, value) => acc + value, 0);
  return sum / filtered_data.length;
}
