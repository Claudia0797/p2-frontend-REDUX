import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { CategoryDTO } from 'src/app/Models/category.dto';
import * as CategoriesActions from 'src/app/Store/categories/categories.actions';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
})
export class CategoriesListComponent implements OnInit {
  categories!: CategoryDTO[];

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    // 1. Nos suscribimos al Store para actualizar la tabla reactivamente
    this.store.select('categories').subscribe((categoriesState) => {
      this.categories = categoriesState.categories;
    });

    // 2. Obtenemos el userId desde el estado de Auth y pedimos las categorías
    this.store.select('auth').pipe(take(1)).subscribe((authState) => {
      if (authState.userId) {
        this.store.dispatch(
          CategoriesActions.getCategoriesByUserIdRequest({ userId: authState.userId })
        );
      }
    });
  }

  createCategory(): void {
    this.router.navigateByUrl('/user/category/'); // O la ruta correspondiente de alta
  }

  updateCategory(categoryId: string): void {
    this.router.navigateByUrl('/user/category/' + categoryId);
  }

  deleteCategory(categoryId: string): void {
    const result = confirm('Confirm delete category with id: ' + categoryId + ' .');
    if (result) {
      // Despachamos la acción de borrado. El efecto y el reducer limpian la vista solos.
      this.store.dispatch(CategoriesActions.deleteCategoryRequest({ categoryId }));
    }
  }
}