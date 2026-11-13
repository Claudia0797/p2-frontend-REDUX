import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { PostRequestDTO } from 'src/app/Models/post-request.dto';
import { PostDTO } from 'src/app/Models/post.dto';
import * as PostsActions from 'src/app/Store/posts/posts.actions';
import * as CategoriesActions from 'src/app/Store/categories/categories.actions';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent implements OnInit {
  post: PostDTO | undefined;
  postId: string | null;
  isUpdateMode: boolean;
  
  categories: CategoryDTO[];

  title: FormControl<string>;
  description: FormControl<string>;
  publication_date: FormControl<string>;
  categories_form: FormControl<string[]>;

  postForm: FormGroup;
  isValidForm: boolean | null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {
    this.isValidForm = null;
    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.post = undefined;
    this.isUpdateMode = false;
    this.categories = [];

    this.title = new FormControl<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(55),
      ],
      nonNullable: true,
    });
    this.description = new FormControl<string>('', {
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(255),
      ],
      nonNullable: true,
    });
    this.publication_date = new FormControl<string>(
      formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      {
        validators: [Validators.required],
        nonNullable: true,
      }
    );
    this.categories_form = new FormControl<string[]>([], {
      validators: [Validators.required],
      nonNullable: true,
    });

    this.postForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      publication_date: this.publication_date,
      categories: this.categories_form,
    });
  }

  ngOnInit(): void {
    // 1. Escuchamos las categorías del Store para rellenar el desplegable
    // (Esto funcionará cuando configuremos el Store de categorías)
    
    this.store.select('categories').subscribe((categoriesState) => {
      this.categories = categoriesState.categories;
    });

    // 2. Si estamos en modo edición, cargamos los datos del post
    if (this.postId) {
      this.isUpdateMode = true;
      
      this.store.select('posts').subscribe((postsState) => {
        const foundPost = postsState.posts.find(p => p.postId === this.postId);
        if (foundPost) {
          this.post = foundPost;
          this.title.setValue(this.post.title);
          this.description.setValue(this.post.description);
          this.publication_date.setValue(
            formatDate(this.post.publication_date, 'yyyy-MM-dd', 'en')
          );
          
          let categoriesIds: string[] = [];
          this.post.categories.forEach((cat: CategoryDTO) => {
            categoriesIds.push(cat.categoryId);
          });
          this.categories_form.setValue(categoriesIds);
        }
      });
    } else {
      // 3. Si es creación, necesitamos cargar las categorías del usuario
      this.store.select('auth').pipe(take(1)).subscribe((authState) => {
        if (authState.userId) {
          // Despacharemos la acción para cargar las categorías del usuario
          this.store.dispatch(CategoriesActions.getCategoriesByUserIdRequest({ userId: authState.userId }));
        }
      });
    }
  }

  savePost(): void {
    this.isValidForm = false;
    if (this.postForm.invalid) {
      return;
    }

    this.isValidForm = true;
    const raw = this.postForm.getRawValue();

    // Arreglamos el formato de la fecha
    let pubDate: Date;
    if (typeof raw.publication_date === 'string') {
      const [y, m, d] = raw.publication_date.split('-').map(Number);
      pubDate = new Date(y, m - 1, d);
    } else {
      pubDate = raw.publication_date;
    }

    // Convertimos los IDs de categorías en objetos básicos
    const selectedCategories = raw.categories.map((id: string) => {
      return { categoryId: id } as CategoryDTO;
    });

    const newPost: PostRequestDTO = {
      title: raw.title,
      description: raw.description,
      publication_date: pubDate,
      categories: selectedCategories
    };

    if (this.isUpdateMode && this.postId) {
      this.store.dispatch(PostsActions.updatePostRequest({ postId: this.postId, post: newPost }));
    } else {
      this.store.dispatch(PostsActions.createPostRequest({ post: newPost }));
    }
  }
}