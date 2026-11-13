import { createReducer, on } from '@ngrx/store';
import { PostDTO } from '../../Models/post.dto';
import * as PostsActions from './posts.actions';
import * as AuthActions from '../auth/auth.actions';

export interface PostsState {
  posts: PostDTO[];
  loading: boolean;
  errorMessage: any;
}

export const initialState: PostsState = {
  posts: [],
  loading: false,
  errorMessage: null,
};

export const postsReducer = createReducer(
  initialState,

  // Get Posts
  on(PostsActions.getPostsRequest, (state) => ({
    ...state,
    loading: true,
    errorMessage: null,
  })),
  on(PostsActions.getPostsSuccess, (state, { posts }) => ({
    ...state,
    posts,
    loading: false,
    errorMessage: null,
  })),
  on(PostsActions.getPostsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    errorMessage: error,
  })),

  // Get Posts By UserId
  on(PostsActions.getPostsByUserIdRequest, (state) => ({
    ...state,
    loading: true,
    errorMessage: null,
  })),
  on(PostsActions.getPostsByUserIdSuccess, (state, { posts }) => ({
    ...state,
    posts,
    loading: false,
    errorMessage: null,
  })),
  on(PostsActions.getPostsByUserIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    errorMessage: error,
  })),

  // Eliminar post (quitamos el post de la lista en memoria al borrar con éxito)
  on(PostsActions.deletePostSuccess, (state, { postId }) => ({
    ...state,
    posts: state.posts.filter((p) => p.postId !== postId),
  })),

  // Al hacer logout, limpiamos el estado
  on(AuthActions.logout, () => initialState)
);