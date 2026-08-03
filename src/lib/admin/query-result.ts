export type AdminQueryResult<T> = {
  data: T | null;
  error: string | null;
};

export function adminOk<T>(data: T): AdminQueryResult<T> {
  return { data, error: null };
}

export function adminErr<T>(message: string): AdminQueryResult<T> {
  return { data: null, error: message };
}
