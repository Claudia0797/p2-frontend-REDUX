import { createReducer, on } from '@ngrx/store';
import { CategoryDTO } from '../../Models/category.dto';
import * as CategoriesActions from './categories.actions';
import * as AuthActions from '../auth/auth.actions';

export interface CategoriesState {
  categories: CategoryDTO[];
  currentCategory: CategoryDTO | null;
  loading: boolean;
  errorMessage: any;
}

export const initialState: CategoriesState = {
  categories: [],
  currentCategory: null,
  loading: false,
  errorMessage: null,
};

export const categoriesReducer = createReducer(
  initialState,

  // Listar por usuario
  on(CategoriesActions.getCategoriesByUserIdRequest, (state) => ({
    ...state,
    loading: true,
    errorMessage: null,
  })),
  on(CategoriesActions.getCategoriesByUserIdSuccess, (state, { categories }) => ({
    ...state,
    categories,
    loading: false,
    errorMessage: null,
  })),
  on(CategoriesActions.getCategoriesByUserIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    errorMessage: error,
  })),

  // Obtener por ID
  on(CategoriesActions.getCategoryByIdRequest, (state) => ({
    ...state,
    loading: true,
    errorMessage: null,
    currentCategory: null,
  })),
  on(CategoriesActions.getCategoryByIdSuccess, (state, { category }) => ({
    ...state,
    currentCategory: category,
    loading: false,
    errorMessage: null,
  })),
  on(CategoriesActions.getCategoryByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    errorMessage: error,
  })),

  // Eliminar categoría (quitamos la eliminada de la lista en memoria)
  on(CategoriesActions.deleteCategorySuccess, (state, { categoryId }) => ({
    ...state,
    categories: state.categories.filter((c) => c.categoryId !== categoryId),
  })),

  // Limpiar estado al hacer logout
  on(AuthActions.logout, () => initialState)
);