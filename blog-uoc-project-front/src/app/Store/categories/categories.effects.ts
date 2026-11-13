import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, exhaustMap } from 'rxjs/operators';
import { SharedService } from '../../Services/shared.service';
import { CategoryService } from '../../Services/category.service';
import * as CategoriesActions from './categories.actions';

@Injectable()
export class CategoriesEffects {
  getCategoriesByUserId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.getCategoriesByUserIdRequest),
      switchMap(({ userId }) =>
        this.categoryService.getCategoriesByUserId(userId).pipe(
          map((categories) => CategoriesActions.getCategoriesByUserIdSuccess({ categories })),
          catchError((error) => {
            this.sharedService.errorLog(error.error);
            return of(CategoriesActions.getCategoriesByUserIdFailure({ error: error.error }));
          })
        )
      )
    )
  );

  getCategoryById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.getCategoryByIdRequest),
      switchMap(({ categoryId }) =>
        this.categoryService.getCategoryById(categoryId).pipe(
          map((category) => CategoriesActions.getCategoryByIdSuccess({ category })),
          catchError((error) => {
            this.sharedService.errorLog(error.error);
            return of(CategoriesActions.getCategoryByIdFailure({ error: error.error }));
          })
        )
      )
    )
  );

  createCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.createCategoryRequest),
      exhaustMap(({ category }) =>
        this.categoryService.createCategory(category).pipe(
          map((createdCategory) => {
            this.sharedService.managementToast('categoryFeedback', true, undefined);
            this.router.navigateByUrl('categories');
            return CategoriesActions.createCategorySuccess({ category: createdCategory });
          }),
          catchError((error) => {
            this.sharedService.errorLog(error.error);
            this.sharedService.managementToast('categoryFeedback', false, error.error);
            return of(CategoriesActions.createCategoryFailure({ error: error.error }));
          })
        )
      )
    )
  );

  updateCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.updateCategoryRequest),
      exhaustMap(({ categoryId, category }) =>
        this.categoryService.updateCategory(categoryId, category).pipe(
          map((updatedCategory) => {
            this.sharedService.managementToast('categoryFeedback', true, undefined);
            this.router.navigateByUrl('categories');
            return CategoriesActions.updateCategorySuccess({ category: updatedCategory });
          }),
          catchError((error) => {
            this.sharedService.errorLog(error.error);
            this.sharedService.managementToast('categoryFeedback', false, error.error);
            return of(CategoriesActions.updateCategoryFailure({ error: error.error }));
          })
        )
      )
    )
  );

  deleteCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoriesActions.deleteCategoryRequest),
      exhaustMap(({ categoryId }) =>
        this.categoryService.deleteCategory(categoryId).pipe(
          map(() => CategoriesActions.deleteCategorySuccess({ categoryId })),
          catchError((error) => {
            this.sharedService.errorLog(error.error);
            return of(CategoriesActions.deleteCategoryFailure({ error: error.error }));
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private categoryService: CategoryService,
    private sharedService: SharedService,
    private router: Router
  ) {}
}