import { ActionReducerMap } from '@ngrx/store';
import * as auth from './Store/auth/auth.reducer';
import * as user from './Store/user/user.reducer';
import * as posts from './Store/posts/posts.reducer';
import * as categories from './Store/categories/categories.reducer';

export interface AppState {
  auth: auth.AuthState;
  user: user.UserState;
  posts: posts.PostsState;
  categories: categories.CategoriesState;
}

export const appReducers: ActionReducerMap<AppState> = {
  auth: auth.authReducer,
  user: user.userReducer,
  posts: posts.postsReducer, 
  categories: categories.categoriesReducer,
};