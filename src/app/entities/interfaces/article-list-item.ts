//Bu interface veritabanından artice datalarını getirirken kullanılır. PageResult<T> ile birlikte çalışır.
export interface ArticleListItem{
  id: string,
  title: string,
  status: number,
  updatedAt: string,
}
