import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { PostDTO } from 'src/app/Models/post.dto';
import * as PostsActions from 'src/app/Store/posts/posts.actions';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent implements OnInit {
  posts!: PostDTO[];

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    // 1. Nos suscribimos al Store para mantener la lista de posts siempre actualizada en pantalla
    this.store.select('posts').subscribe((postsState) => {
      this.posts = postsState.posts;
    });

    // 2. Extraemos el userId desde el estado global (Auth) en vez del localStorage
    this.store.select('auth').pipe(take(1)).subscribe((authState) => {
      if (authState.userId) {
        // 3. Disparamos la acción para cargar solo los posts de este usuario
        this.store.dispatch(
          PostsActions.getPostsByUserIdRequest({ userId: authState.userId })
        );
      }
    });
  }

  createPost(): void {
    this.router.navigateByUrl('/user/post/');
  }

  updatePost(postId: string): void {
    this.router.navigateByUrl('/user/post/' + postId);
  }

  deletePost(postId: string): void {
    const result = confirm('Confirm delete post with id: ' + postId + ' .');
    
    if (result) {
      // Solo lanzamos el "ticket".
      // El Effect borrará en base de datos y el Reducer lo quitará de la memoria automáticamente.
      this.store.dispatch(PostsActions.deletePostRequest({ postId }));
    }
  }
}