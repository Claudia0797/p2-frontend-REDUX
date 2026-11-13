import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
import { SharedService } from '../../Services/shared.service';
import { UserService } from '../../Services/user.service';
import * as UserActions from './user.actions';

@Injectable()
export class UserEffects {
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.registerRequest),
      exhaustMap(({ user }) =>
        this.userService.register(user).pipe(
          map((createdUser) => {
            this.sharedService.managementToast('registerFeedback', true, undefined);
            this.router.navigateByUrl('home');
            return UserActions.registerSuccess({ user: createdUser });
          }),
          catchError((error) => {
            this.sharedService.errorLog(error.error);
            this.sharedService.managementToast('registerFeedback', false, error.error);
            return of(UserActions.registerFailure({ error: error.error }));
          })
        )
      )
    )
  );

  getUserById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getUserByIdRequest),
      switchMap(({ userId }) =>
        this.userService.getUSerById(userId).pipe(
          map((user) => UserActions.getUserByIdSuccess({ user })),
          catchError((error) => {
            this.sharedService.errorLog(error.error);
            return of(UserActions.getUserByIdFailure({ error: error.error }));
          })
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserRequest),
      exhaustMap(({ userId, user }) =>
        this.userService.updateUser(userId, user).pipe(
          map((updatedUser) => {
            this.sharedService.managementToast('profileFeedback', true, undefined);
            return UserActions.updateUserSuccess({ user: updatedUser });
          }),
          catchError((error) => {
            this.sharedService.errorLog(error.error);
            this.sharedService.managementToast('profileFeedback', false, error.error);
            return of(UserActions.updateUserFailure({ error: error.error }));
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private sharedService: SharedService,
    private router: Router
  ) {}
}