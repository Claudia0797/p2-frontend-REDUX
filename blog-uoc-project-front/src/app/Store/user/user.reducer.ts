import { createReducer, on } from '@ngrx/store';
import { UserDTO } from '../../Models/user.dto';
import * as UserActions from './user.actions';
import * as AuthActions from '../auth/auth.actions';

export interface UserState { 
    user: UserDTO | null;
    loading: boolean;
    errorMessage: any;
}

export const initialState: UserState = {
    user: null,
    loading: false,
    errorMessage: null,
}

export const userReducer = createReducer(
    initialState,

    // Registro
    on(UserActions.registerRequest, (state) => ({
        ...state,
        loading: true,
        errorMessage: null,
    })),

    on(UserActions.registerSuccess, (state, { user }) => ({
        ...state,
        user,
        loading: false,
        errorMessage: null
    })),

    on(UserActions.registerFailure, (state, { error }) => ({
        ...state,
        loading: false,
        errorMessage: error,
    })),

    // Get User By Id
    on(UserActions.getUserByIdRequest, (state) => ({
        ...state,
        loading: true,
        errorMessage: null
    })),
    on(UserActions.getUserByIdSuccess, (state, { user }) => ({
        ...state,
        user,
        loading: false,
        errorMessage: null,
    })),
    on(UserActions.getUserByIdFailure, (state, { error }) => ({
        ...state,
        loading: false,
        errorMessage: error,
    })),

    // Actualizar User
    on(UserActions.updateUserRequest, (state) => ({
        ...state,
        loading: true,
        errorMessage: null,
    })),
    on(UserActions.updateUserSuccess, (state, { user }) => ({
        ...state,
        user,
        loading: false,
        errorMessage: null
    })),
    on(UserActions.updateUserFailure, (state, { error }) => ({
        ...state,
        loading: false,
        errorMessage: error,
    })),

    // Limpiar datos del usuario al hacer logout
    on(AuthActions.logout, () => initialState)
);