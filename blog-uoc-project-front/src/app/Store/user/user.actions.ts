import { createAction, props } from '@ngrx/store';
import { UserDTO } from '../../Models/user.dto';

// Registro
export const registerRequest = createAction(
    '[User] Register Request',
    props<{ user: UserDTO }>()
);

export const registerSuccess = createAction(
    '[User] Register Success',
    props<{ user: UserDTO }>()
);

export const registerFailure = createAction(
    '[User] Register Failure',
    props<{ error: any }>()
);

// Obtener datos del perfil
export const getUserByIdRequest = createAction(
  '[User] Get User By Id Request',
  props<{ userId: string }>()
);

export const getUserByIdSuccess = createAction(
  '[User] Get User By Id Success',
  props<{ user: UserDTO }>()
);

export const getUserByIdFailure = createAction(
    '[User] Get User By Id Failure',
    props<{ error: any }>()
);

// Actualizar datos del perfil
export const updateUserRequest = createAction(
    '[User] Update User Request',
    props<{ userId: string; user: UserDTO }>()
);

export const updateUserSuccess = createAction(
  '[User] Update User Success',
  props<{ user: UserDTO }>()
);

export const updateUserFailure = createAction(
  '[User] Update User Failure',
  props<{ error: any }>()
);