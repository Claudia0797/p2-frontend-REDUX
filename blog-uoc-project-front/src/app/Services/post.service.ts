import { HttpClient } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostRequestDTO } from '../Models/post-request.dto';
import { PostDTO } from '../Models/post.dto';


// PostService: getPosts, getPostsByUserId, createPost, getPostById, updatePost, 
// likePost, dislikePost, deletePost 

interface updateResponse {
  affected: number;
}

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private urlBlogUocApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'posts';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  getPosts(): Observable<PostDTO[]> {
    return this.http.get<PostDTO[]>(this.urlBlogUocApi);
  }

  getPostsByUserId(userId: string): Observable<PostDTO[]> {
    // TODO 22
    return this.http
      .get<PostDTO[]>('http://localhost:3000/users/posts/' + userId);
  }

  getPostById(postId: string): Observable<PostDTO> {
    return this.http
      .get<PostDTO>(this.urlBlogUocApi + '/' + postId);
  }

  createPost(post: PostRequestDTO): Observable<PostDTO> {
    return this.http.post<PostDTO>(this.urlBlogUocApi, post);
  }

  updatePost(postId: string, post: PostRequestDTO): Observable<PostDTO> {
    return this.http
      .put<PostDTO>(this.urlBlogUocApi + '/' + postId, post);
  }

  likePost(postId: string): Observable<updateResponse> {
    return this.http
      .put<updateResponse>(this.urlBlogUocApi + '/like/' + postId, NONE_TYPE);
  }

  dislikePost(postId: string): Observable<updateResponse> {
    return this.http
      .put<updateResponse>(this.urlBlogUocApi + '/dislike/' + postId, NONE_TYPE);
  }

  deletePost(postId: string): Observable<deleteResponse> {
    return this.http
      .delete<deleteResponse>(this.urlBlogUocApi + '/' + postId);
  }
}