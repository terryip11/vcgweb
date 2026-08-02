export function escapeCsvField(value: string | number | null | undefined): string {
  if (value == null) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildCsv(
  headers: string[],
  rows: (string | number | null | undefined)[][],
): string {
  const bom = "\uFEFF";
  const headerLine = headers.map(escapeCsvField).join(",");
  const dataLines = rows.map((row) => row.map(escapeCsvField).join(","));
  return bom + [headerLine, ...dataLines].join("\r\n");
}
