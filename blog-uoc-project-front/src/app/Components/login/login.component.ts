import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import { AuthDTO } from '../../Models/auth.dto';
import { HeaderMenus } from '../../Models/header-menus.dto';

type LoginFormModel = {
  email: FormControl<string>;
  password: FormControl<string>;
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // TODO 19
  loginUser: AuthDTO;
  email: FormControl<string>;
  password: FormControl<string>;
  loginForm: FormGroup<LoginFormModel>;

  isValidForm: boolean | null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService,
    private router: Router,
  ) {
    // TODO 20

    this.loginUser = new AuthDTO('', '', '', '');
    this.isValidForm = null;

    this.email = new FormControl(this.loginUser.email, {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    });

    this.password = new FormControl(this.loginUser.password, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
      ],
    });

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit(): void {}

  async login(): Promise<void> {
    this.isValidForm = false;
    if (this.loginForm.invalid) {
      return;
    }

    this.isValidForm = true;

    let responseOK = false;
    let errorResponse: any;

    const { email, password } = this.loginForm.getRawValue();

    this.loginUser.email = email;
    this.loginUser.password = password;

    try {
      const authToken = await this.authService.login(this.loginUser);

      responseOK = true;
      this.loginUser.user_id = authToken.user_id;
      this.loginUser.access_token = authToken.access_token;

      // Save token to localStorage
      this.localStorageService.set('user_id', this.loginUser.user_id);
      this.localStorageService.set('access_token', this.loginUser.access_token);
    } catch (error: any) {
      responseOK = false;
      errorResponse = error.error;

      const headerInfo: HeaderMenus = {
        showAuthSection: false,
        showNoAuthSection: true,
      };

      this.headerMenusService.headerManagement.next(headerInfo);
      this.sharedService.errorLog(error.error);
    }

    await this.sharedService.managementToast(
      'loginFeedback',
      responseOK,
      errorResponse,
    );

    if (responseOK) {
      const headerInfo: HeaderMenus = {
        showAuthSection: true,
        showNoAuthSection: false,
      };

      this.headerMenusService.headerManagement.next(headerInfo);
      this.router.navigateByUrl('home');
    }
  }
}
