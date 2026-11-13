import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { PostDTO } from 'src/app/Models/post.dto';
import * as PostsActions from 'src/app/Store/posts/posts.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public totalLikes: number = 0;
  public totalDislikes: number = 0;
  public posts!: PostDTO[];

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    // 1. Escuchamos el Store para obtener los posts y calcular las métricas
    this.store.select('posts').subscribe((postsState) => {
      this.posts = postsState.posts;
      
      // Reseteamos y recalculamos los totales basándonos en los datos reactivos del Store
      this.totalLikes = 0;
      this.totalDislikes = 0;

      for (let post of this.posts) {
        this.totalLikes += post.num_likes;
        this.totalDislikes += post.num_dislikes;
      }
    });

    // 2. Disparamos la carga inicial de datos al backend
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Ya no usamos async/await ni llamamos al servicio. El Effect se encarga.
    this.store.dispatch(PostsActions.getPostsRequest());
  }
}