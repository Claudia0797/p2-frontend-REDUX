import { CategoryDTO } from './category.dto';

export class PostDTO {
  postId!: string;
  title!: string;
  description!: string;
  num_likes!: number;
  num_dislikes!: number;
  publication_date!: Date;
  userId!: string;
  categories!: CategoryDTO[];
  userAlias!: string;

  constructor(
    title: string,
    description: string,
    num_likes: number,
    num_dislikes: number,
    publication_date: Date,
    userId: string = '',
    categories: CategoryDTO[] = [],
    postId: string = '',
  ) {
    this.postId = postId;
    this.title = title;
    this.description = description;
    this.num_likes = num_likes;
    this.num_dislikes = num_dislikes;
    this.publication_date = publication_date;
    this.userId = userId;
    this.categories = categories;
  }
}
