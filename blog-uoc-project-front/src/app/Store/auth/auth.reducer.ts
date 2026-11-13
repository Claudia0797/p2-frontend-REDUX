import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { state } from '@angular/animations';

export interface AuthState {
  userId: string | null;
  accessToken: string | null;
  errorMessage: string | null;
  loading: boolean;
}

export const initialState: AuthState = {
  userId: null,
  accessToken: null,
  errorMessage: null,
  loading: false,
};

export const authReducer = createReducer(
  initialState,

  // Cuando se lanza la petición de login, activamos el indicador de carga
  on(AuthActions.loginRequest, (state) => ({
    ...state,
    loading: true,
    errorMessage: null,
  })),

  // Si el login va bien, guardamos el userId y el accessToken, y quitamos la carga
  on(AuthActions.loginSuccess, (state, { userId, accessToken }) => ({
    ...state,
    userId,
    accessToken,
    loading: false,
    errorMessage: null,
  })),

  // Al hacer logout, limpiamos todo el estado de golpe
  on(AuthActions.logout, () => initialState)
);

