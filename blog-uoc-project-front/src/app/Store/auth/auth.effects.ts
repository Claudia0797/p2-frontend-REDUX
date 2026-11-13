import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, exhaustMap, tap, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import * as AuthActions from './auth.actions';
import { SharedService } from '../../Services/shared.service';
import { LocalStorageService } from '../../Services/local-storage.service';


@Injectable()
export class AuthEffects {
  // Efecto que escucha la acción loginRequest
  login$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AuthActions.loginRequest),
      exhaustMap(({ credentials }) => 
        this.authService.login(credentials).pipe(
          map((response) => {
            // Guardamos los datos en el LocalStorage (o gestionamos tokens)
            this.localStorageService.set('user_id', response.user_id);
            this.localStorageService.set('access_token', response.access_token);

            // Lanzamos feedback positivo y redirigimos
            this.sharedService.managementToast('loginFeedback', true, undefined);
            this.router.navigateByUrl('home');

            // Devolvemos la acción de éxito con los datos
            return AuthActions.loginSuccess({
              userId: response.user_id,
              accessToken: response.access_token,
            });
          }),
          catchError((error) => {
            // Gestionamos el error si falla la llamada
            const errorMsg = error.error?.message || 'Error en el login';
            this.sharedService.errorLog(error.error);
            this.sharedService.managementToast('loginFeedback', false, error.error);

            return of(AuthActions.loginFailure({ error: errorMsg }));
          })
        ))
    )
  )

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.localStorageService.remove('user_id');
          this.localStorageService.remove('access_token');
          this.router.navigateByUrl('home');
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService
  ) {}
}