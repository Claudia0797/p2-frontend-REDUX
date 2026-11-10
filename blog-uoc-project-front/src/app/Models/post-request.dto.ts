export class PostRequestDTO {
  title!: string;
  description!: string;
  publication_date!: Date;
  userId!: string;
  categories!: string[];
  num_likes!: number;
  num_dislikes!: number;

  constructor(
    title: string,
    description: string,
    publication_date: Date,
    userId: string,
    categories: string[],
    num_likes: number = 0,
    num_dislikes: number = 0,
  ) {
    this.title = title;
    this.description = description;
    this.publication_date = publication_date;
    this.userId = userId;
    this.categories = categories;
    this.num_likes = num_likes;
    this.num_dislikes = num_dislikes;
  }
}
