import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(
      take(1),
      switchMap((authState: any) => {
        if (authState.accessToken) {
          req = req.clone({
            setHeaders: {
              'Content-Type': 'application/json; charset=utf-8',
              Accept: 'application/json',
              Authorization: `Bearer ${authState.accessToken}`,
            },
          });
        }
        return next.handle(req);
      })
    );
  }
}