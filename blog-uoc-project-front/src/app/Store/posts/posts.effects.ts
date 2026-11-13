import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, exhaustMap } from 'rxjs/operators';
import { SharedService } from '../../Services/shared.service';
import { PostService } from '../../Services/post.service';
import * as PostsActions from './posts.actions';

@Injectable()
export class PostsEffects {
  getPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.getPostsRequest),
      switchMap(() =>
        this.postService.getPosts().pipe(
          map((posts) => PostsActions.getPostsSuccess({ posts })),
          catchError((error) => {
            this.sharedService.errorLog(error.error);
            return of(PostsActions.getPostsFailure({ error: error.error }));
          })
        )
      )
    )
  );

  getPostsByUserId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.getPostsByUserIdRequest),
      switchMap(({ userId }) =>
        this.postService.getPostsByUserId(userId).pipe(
          map((posts) => PostsActions.getPostsByUserIdSuccess({ posts })),
          catchError((error) => {
            this.sharedService.errorLog(error.error);
            return of(
              PostsActions.getPostsByUserIdFailure({ error: error.error })
            );
          })
        )
      )
    )
  );

  createPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.createPostRequest),
      exhaustMap(({ post }) =>
        this.postService.createPost(post).pipe(
          map((createdPost) => {
            this.sharedService.managementToast('postFeedback', true, undefined);
            this.router.navigateByUrl('posts');
            return PostsActions.createPostSuccess({ post: createdPost });
          }),
          catchError((error) => {
            this.sharedService.errorLog(error.error);
            this.sharedService.managementToast('postFeedback', false, error.error);
            return of(PostsActions.createPostFailure({ error: error.error }));
          })
        )
      )
    )
  );

  updatePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.updatePostRequest),
      exhaustMap(({ postId, post }) =>
        this.postService.updatePost(postId, post).pipe(
          map((updatedPost) => {
            this.sharedService.managementToast('postFeedback', true, undefined);
            this.router.navigateByUrl('posts');
            return PostsActions.updatePostSuccess({ post: updatedPost });
          }),
          catchError((error) => {
            this.sharedService.errorLog(error.error);
            this.sharedService.managementToast('postFeedback', false, error.error);
            return of(PostsActions.updatePostFailure({ error: error.error }));
          })
        )
      )
    )
  );

  deletePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.deletePostRequest),
      exhaustMap(({ postId }) =>
        this.postService.deletePost(postId).pipe(
          map(() => PostsActions.deletePostSuccess({ postId })),
          catchError((error) => {
            this.sharedService.errorLog(error.error);
            return of(PostsActions.deletePostFailure({ error: error.error }));
          })
        )
      )
    )
  );

  likePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.likePostRequest),
      exhaustMap(({ postId }) =>
        this.postService.likePost(postId).pipe(
          map(() => PostsActions.likePostSuccess()),
          catchError((error) => {
            this.sharedService.errorLog(error.error);
            return of(PostsActions.likePostFailure({ error: error.error }));
          })
        )
      )
    )
  );

  dislikePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostsActions.dislikePostRequest),
      exhaustMap(({ postId }) =>
        this.postService.dislikePost(postId).pipe(
          map(() => PostsActions.dislikePostSuccess()),
          catchError((error) => {
            this.sharedService.errorLog(error.error);
            return of(PostsActions.dislikePostFailure({ error: error.error }));
          })
        )
      )
    )
  );

  // Efecto secundario: recargar la vista después de un like, dislike o borrado
  reloadPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PostsActions.likePostSuccess,
        PostsActions.dislikePostSuccess
      ),
      map(() => PostsActions.getPostsRequest())
    )
  );

  constructor(
    private actions$: Actions,
    private postService: PostService,
    private sharedService: SharedService,
    private router: Router
  ) {}
}