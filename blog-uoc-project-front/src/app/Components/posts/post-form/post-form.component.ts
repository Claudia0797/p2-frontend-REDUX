import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/Services/category.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';
import { CategoryDTO } from '../../../Models/category.dto';
import { PostRequestDTO } from '../../../Models/post-request.dto';
import { PostDTO } from '../../../Models/post.dto';

type PostFormModel = {
  title: FormControl<string>;
  description: FormControl<string>;
  publication_date: FormControl<string>;
  categories: FormControl<string[]>;
};

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent implements OnInit {
  post: PostDTO;
  postRequest: PostRequestDTO;
  categoriesList: CategoryDTO[];

  title: FormControl<string>;
  description: FormControl<string>;
  publication_date: FormControl<string>;
  categories: FormControl<string[]>;

  postForm: FormGroup<PostFormModel>;
  isValidForm: boolean | null;

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private postId: string | null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
    private categoryService: CategoryService,
  ) {
    // TODO 13
    this.isValidForm = null;
    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.post = new PostDTO('', '', 0, 0, new Date());
    this.postRequest = new PostRequestDTO('', '', new Date(), '', [], 0, 0);
    this.categoriesList = [];
    this.isUpdateMode = false;
    this.validRequest = false;

    this.title = new FormControl(this.post.title, {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(55)],
    });

    this.description = new FormControl(this.post.description, {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    });

    this.publication_date = new FormControl(
      formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    );

    this.categories = new FormControl<string[]>([], {
      nonNullable: true,
      validators: [Validators.required],
    });

    this.postForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      publication_date: this.publication_date,
      categories: this.categories,
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadCategories();

    let errorResponse: any;

    if (this.postId) {
      this.isUpdateMode = true;
      try {
        this.post = await this.postService.getPostById(this.postId);

        this.title.setValue(this.post.title);
        this.description.setValue(this.post.description);
        this.publication_date.setValue(
          formatDate(this.post.publication_date, 'yyyy-MM-dd', 'en'),
        );
        this.categories.setValue(
          this.post.categories?.map((category) => category.categoryId) ?? [],
        );
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }

  private async loadCategories(): Promise<void> {
    let errorResponse: any;
    const userId = this.localStorageService.get('user_id');

    if (userId) {
      try {
        this.categoriesList =
          await this.categoryService.getCategoriesByUserId(userId);
      } catch (error: any) {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      }
    }
  }

  private async createPost(): Promise<boolean> {
    let errorResponse: any;
    let responseOK = false;

    try {
      await this.postService.createPost(this.postRequest);
      responseOK = true;
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
    }

    await this.sharedService.managementToast(
      'postFeedback',
      responseOK,
      errorResponse,
    );

    if (responseOK) {
      this.router.navigateByUrl('posts');
    }

    return responseOK;
  }

  private async editPost(): Promise<boolean> {
    let errorResponse: any;
    let responseOK = false;

    if (!this.postId) {
      return false;
    }

    try {
      await this.postService.updatePost(this.postId, this.postRequest);
      responseOK = true;
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
    }

    await this.sharedService.managementToast(
      'postFeedback',
      responseOK,
      errorResponse,
    );

    if (responseOK) {
      this.router.navigateByUrl('posts');
    }

    return responseOK;
  }

  async savePost(): Promise<void> {
    this.isValidForm = false;

    if (this.postForm.invalid) {
      return;
    }

    this.isValidForm = true;

    const userId = this.localStorageService.get('user_id');
    if (!userId) {
      return;
    }

    const { title, description, publication_date, categories } =
      this.postForm.getRawValue();

    const [y, m, d] = publication_date.split('-').map(Number);
    const publicationDate = new Date(y, m - 1, d);

    this.postRequest = new PostRequestDTO(
      title,
      description,
      publicationDate,
      userId,
      categories,
      this.isUpdateMode ? this.post.num_likes : 0,
      this.isUpdateMode ? this.post.num_dislikes : 0,
    );

    if (this.isUpdateMode) {
      this.validRequest = await this.editPost();
    } else {
      this.validRequest = await this.createPost();
    }
  }
}
