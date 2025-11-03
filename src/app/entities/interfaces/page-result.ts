export interface PageResult<T>{
  page: number,
  pageSize: number,
  total: number,
  items: T[],
}
