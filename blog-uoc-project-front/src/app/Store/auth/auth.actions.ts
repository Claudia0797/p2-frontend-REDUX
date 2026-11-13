import { createAction, props } from '@ngrx/store';
import { AuthDTO } from '../../Models/auth.dto';

export const loginRequest = createAction('[Auth] Login Request', props<{ credentials: AuthDTO }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ userId: string; accessToken: string }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());
export const logout = createAction('[Auth] Logout');