import { Component, OnInit } from '@angular/core';
import { PostDTO } from 'src/app/Models/post.dto';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  posts!: PostDTO[];
  totalLikes: number;
  totalDislikes: number;

  constructor(
    private postService: PostService,
    private sharedService: SharedService,
  ) {
    this.totalLikes = 0;
    this.totalDislikes = 0;
  }

  async ngOnInit(): Promise<void> {
    await this.loadDashboardData();
  }

  private async loadDashboardData(): Promise<void> {
    let errorResponse: any;

    try {
      this.posts = await this.postService.getPosts();

      this.totalLikes = 0;
      this.totalDislikes = 0;

      this.posts.forEach((post) => {
        this.totalLikes += post.num_likes;
        this.totalDislikes += post.num_dislikes;
      });
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
    }
  }
}
