import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoriesListComponent } from './Components/categories/categories-list/categories-list.component';
import { CategoryFormComponent } from './Components/categories/category-form/category-form.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { FooterComponent } from './Components/footer/footer.component';
import { HeaderComponent } from './Components/header/header.component';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { PostFormComponent } from './Components/posts/post-form/post-form.component';
import { PostsListComponent } from './Components/posts/posts-list/posts-list.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { RegisterComponent } from './Components/register/register.component';
import { FormatDatePipe } from './Pipes/format-date.pipe';
import { AuthInterceptorService } from './Services/auth-interceptor.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducers } from './app.reducer';
import { AuthEffects } from './Store/auth/auth.effects';
import { UserEffects } from './Store/user/user.effects';
import { PostsEffects } from './Store/posts/posts.effects';
import { CategoriesEffects } from './Store/categories/categories.effects';
 
@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProfileComponent,
    PostsListComponent,
    CategoriesListComponent,
    CategoryFormComponent,
    PostFormComponent,
    FormatDatePipe,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot(appReducers), // 1. Iniciamos el Store con nuestros reducers
    EffectsModule.forRoot([AuthEffects, UserEffects, PostsEffects, CategoriesEffects]), // 2. Iniciamos los Efectos (aquí iremos añadiendo los demás cuando los creemos)
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: false }) // 3. Activamos la extensión del navegador para ver el estado visualmente
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
