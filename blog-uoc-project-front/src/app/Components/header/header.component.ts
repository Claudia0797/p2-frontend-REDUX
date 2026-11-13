import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as AuthActions from 'src/app/Store/auth/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  showAuthSection: boolean;
  showNoAuthSection: boolean;

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    this.showAuthSection = false;
    this.showNoAuthSection = true;
  }

  ngOnInit(): void {
    this.store.select('auth').subscribe((authState) => {
      if(authState.accessToken) {
        this.showAuthSection = true;
        this.showNoAuthSection = false;
      } else {
        this.showAuthSection = false;
        this.showNoAuthSection = true;
      }
    });
  }

  home(): void {
    this.router.navigateByUrl('home');
  }

  login(): void {
    this.router.navigateByUrl('login');
  }

  register(): void {
    this.router.navigateByUrl('register');
  }

  adminPosts(): void {
    this.router.navigateByUrl('posts');
  }

  adminCategories(): void {
    this.router.navigateByUrl('categories');
  }

  profile(): void {
    this.router.navigateByUrl('profile');
  }

  dashboard(): void {
    this.router.navigateByUrl('dashboard');
  }

  logout(): void {
   this.store.dispatch(AuthActions.logout());
  }
}
