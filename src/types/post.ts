export interface Post {
  id: number;
  description: string;
  detailsText: string;
  imageUrl: string;
  facebookLink: string;
  twitterLink: string;
  instagramLink: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  total?: number;
  error?: string;
}
