import { createAction, props } from '@ngrx/store';
import { CategoryDTO } from '../../Models/category.dto';

// Obtener categorías por usuario
export const getCategoriesByUserIdRequest = createAction(
  '[Categories] Get By UserId Request',
  props<{ userId: string }>()
);
export const getCategoriesByUserIdSuccess = createAction(
  '[Categories] Get By UserId Success',
  props<{ categories: CategoryDTO[] }>()
);
export const getCategoriesByUserIdFailure = createAction(
  '[Categories] Get By UserId Failure',
  props<{ error: any }>()
);

// Obtener categoría por ID
export const getCategoryByIdRequest = createAction(
  '[Categories] Get By Id Request',
  props<{ categoryId: string }>()
);
export const getCategoryByIdSuccess = createAction(
  '[Categories] Get By Id Success',
  props<{ category: CategoryDTO }>()
);
export const getCategoryByIdFailure = createAction(
  '[Categories] Get By Id Failure',
  props<{ error: any }>()
);

// Crear categoría
export const createCategoryRequest = createAction(
  '[Categories] Create Request',
  props<{ category: CategoryDTO }>()
);
export const createCategorySuccess = createAction(
  '[Categories] Create Success',
  props<{ category: CategoryDTO }>()
);
export const createCategoryFailure = createAction(
  '[Categories] Create Failure',
  props<{ error: any }>()
);

// Actualizar categoría
export const updateCategoryRequest = createAction(
  '[Categories] Update Request',
  props<{ categoryId: string; category: CategoryDTO }>()
);
export const updateCategorySuccess = createAction(
  '[Categories] Update Success',
  props<{ category: CategoryDTO }>()
);
export const updateCategoryFailure = createAction(
  '[Categories] Update Failure',
  props<{ error: any }>()
);

// Eliminar categoría
export const deleteCategoryRequest = createAction(
  '[Categories] Delete Request',
  props<{ categoryId: string }>()
);
export const deleteCategorySuccess = createAction(
  '[Categories] Delete Success',
  props<{ categoryId: string }>()
);
export const deleteCategoryFailure = createAction(
  '[Categories] Delete Failure',
  props<{ error: any }>()
);