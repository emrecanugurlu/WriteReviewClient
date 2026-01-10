export type PagedResult<T> = {
  page: number;
  pageSize: number;
  totalItems: number;
  items: T[];
};