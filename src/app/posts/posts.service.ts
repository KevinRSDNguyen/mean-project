import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {Post} from './post.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    this.http.get('http://localhost:3000/api/posts')
      .pipe(map((postData: any) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return {
      ...this.posts.find(post => post.id === id)
    };
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title, content};
    this.http.post('http://localhost:3000/api/posts', post)
      .subscribe((responseData: any) => {
        post.id = responseData.postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http.delete(`http://localhost:3000/api/posts/${postId}`)
    .subscribe((responseData: any) => {
      const updatedPosts = this.posts.filter(post => {
        return post.id !== postId;
      });
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }
}
