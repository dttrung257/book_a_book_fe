export interface FilterSearch {
  //num of items in 1 page
  size?: number;
  page?: number | string;
  name?: string;
  category?: string;
  rating: number | string;
  from?: number | string;
  to?: number | string;
  best_selling?: boolean | string;
}
