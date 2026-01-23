export interface PostData {
  post_id: number;
  title: string;
  content: string;
  user_id: {
    name: string;
  };
  created_at: string;
}
