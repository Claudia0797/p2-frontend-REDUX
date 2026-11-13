import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { PostDTO } from 'src/app/Models/post.dto';
import * as PostsActions from 'src/app/Store/posts/posts.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  posts!: PostDTO[];
  showButtons: boolean;

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    this.showButtons = false;
  }

  ngOnInit(): void {
    // 1. Escuchamos el estado de autenticación para mostrar/ocultar botones
    this.store.select('auth').subscribe((authState) => {
      this.showButtons = !!authState.accessToken;
    });

    // 2. Escuchamos el estado de los posts para actualizar la vista automáticamente
    this.store.select('posts').subscribe((postsState) => {
      this.posts = postsState.posts;
    });

    // 3. Disparamos la acción inicial para cargar los posts desde el backend
    this.loadPosts();
  }

  private loadPosts(): void {
    this.store.dispatch(PostsActions.getPostsRequest());
  }

  like(postId: string): void {
    this.store.dispatch(PostsActions.likePostRequest({ postId }));
  }

  dislike(postId: string): void {
    this.store.dispatch(PostsActions.dislikePostRequest({ postId }));
  }
}