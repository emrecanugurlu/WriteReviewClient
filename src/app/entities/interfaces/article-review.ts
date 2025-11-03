export interface ArticleReview {
  id: string;
  action: number;
  note?: string | null;
  reason?: string | null;
  fromStatus: number;
  toStatus: number;
  reviewerId: string;
  createdAt: string;
}
