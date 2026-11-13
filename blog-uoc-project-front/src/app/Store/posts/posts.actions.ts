import { createAction, props } from '@ngrx/store';
import { PostDTO } from '../../Models/post.dto';
import { PostRequestDTO } from '../../Models/post-request.dto';

// Obtener todos los posts
export const getPostsRequest = createAction('[Posts] Get All Request');
export const getPostsSuccess = createAction(
  '[Posts] Get All Success',
  props<{ posts: PostDTO[] }>()
);
export const getPostsFailure = createAction(
  '[Posts] Get All Failure',
  props<{ error: any }>()
);

// Obtener posts de un usuario específico
export const getPostsByUserIdRequest = createAction(
  '[Posts] Get By UserId Request',
  props<{ userId: string }>()
);
export const getPostsByUserIdSuccess = createAction(
  '[Posts] Get By UserId Success',
  props<{ posts: PostDTO[] }>()
);
export const getPostsByUserIdFailure = createAction(
  '[Posts] Get By UserId Failure',
  props<{ error: any }>()
);

// Crear post
export const createPostRequest = createAction(
  '[Posts] Create Request',
  props<{ post: PostRequestDTO }>()
);
export const createPostSuccess = createAction(
  '[Posts] Create Success',
  props<{ post: PostDTO }>()
);
export const createPostFailure = createAction(
  '[Posts] Create Failure',
  props<{ error: any }>()
);

// Actualizar post
export const updatePostRequest = createAction(
  '[Posts] Update Request',
  props<{ postId: string; post: PostRequestDTO }>()
);
export const updatePostSuccess = createAction(
  '[Posts] Update Success',
  props<{ post: PostDTO }>()
);
export const updatePostFailure = createAction(
  '[Posts] Update Failure',
  props<{ error: any }>()
);

// Eliminar post
export const deletePostRequest = createAction(
  '[Posts] Delete Request',
  props<{ postId: string }>()
);
export const deletePostSuccess = createAction(
  '[Posts] Delete Success',
  props<{ postId: string }>()
);
export const deletePostFailure = createAction(
  '[Posts] Delete Failure',
  props<{ error: any }>()
);

// Likes y Dislikes
export const likePostRequest = createAction(
  '[Posts] Like Request',
  props<{ postId: string }>()
);
export const likePostSuccess = createAction('[Posts] Like Success');
export const likePostFailure = createAction(
  '[Posts] Like Failure',
  props<{ error: any }>()
);

export const dislikePostRequest = createAction(
  '[Posts] Dislike Request',
  props<{ postId: string }>()
);
export const dislikePostSuccess = createAction('[Posts] Dislike Success');
export const dislikePostFailure = createAction(
  '[Posts] Dislike Failure',
  props<{ error: any }>()
);