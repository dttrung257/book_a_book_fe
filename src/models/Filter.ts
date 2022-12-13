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

export interface FilterBookDashboard {
  name?: string;
  category?: string;
  priceFrom?: number | string;
  priceTo?: number | string;
  rating?: string;
}

export interface FilterCommentDashboard {
  bookID?: string;
  bookName?: string;
  date?: string;
  userName?: string;
}

export interface FilterOrderDashboard {
  name?: string;
  status?: string;
  priceFrom?: number | string;
  priceTo?: number | string;
  date?: string;
}
