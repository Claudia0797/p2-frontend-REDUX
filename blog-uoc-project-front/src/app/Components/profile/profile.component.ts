import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';
import { UserDTO } from '../../Models/user.dto';

type ProfileFormModel = {
  name: FormControl<string>;
  surname_1: FormControl<string>;
  surname_2: FormControl<string>;
  alias: FormControl<string>;
  birth_date: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
};

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  // TODO 4
  profileUser: UserDTO;

  name: FormControl<string>;
  surname_1: FormControl<string>;
  surname_2: FormControl<string>;
  alias: FormControl<string>;
  birth_date: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;

  profileForm: FormGroup<ProfileFormModel>;
  isValidForm: boolean | null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
  ) {
    // TODO 5
    this.profileUser = new UserDTO('', '', '', '', new Date(), '', '');
    this.isValidForm = null;

    this.name = new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25),
      ],
    });

    this.surname_1 = new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25),
      ],
    });

    this.surname_2 = new FormControl('', {
      nonNullable: true,
      validators: [Validators.minLength(5), Validators.maxLength(25)],
    });

    this.alias = new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25),
      ],
    });

    this.birth_date = new FormControl(
      formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    );

    this.email = new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    });

    this.password = new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
      ],
    });

    this.profileForm = this.formBuilder.group({
      name: this.name,
      surname_1: this.surname_1,
      surname_2: this.surname_2,
      alias: this.alias,
      birth_date: this.birth_date,
      email: this.email,
      password: this.password,
    });
  }

  async ngOnInit(): Promise<void> {
    let errorResponse: any;

    const userId = this.localStorageService.get('user_id');
    if (!userId) return;

    try {
      const userData = await this.userService.getUSerById(userId);

      this.profileForm.patchValue({
        name: userData.name,
        surname_1: userData.surname_1,
        surname_2: userData.surname_2 ?? '',
        alias: userData.alias,
        birth_date: formatDate(userData.birth_date, 'yyyy-MM-dd', 'en'),
        email: userData.email,
        // password NO se rellena desde backend (normalmente)
      });
    } catch (error: any) {
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
    }
  }

  async updateUser(): Promise<void> {
    let responseOK = false;
    this.isValidForm = false;
    let errorResponse: any;

    if (this.profileForm.invalid) return;
    this.isValidForm = true;

    const userId = this.localStorageService.get('user_id');
    if (!userId) return;

    const raw = this.profileForm.getRawValue();

    // Parse de fecha (evita problemas de zona horaria)
    const [y, m, d] = raw.birth_date.split('-').map(Number);
    const birthDate = new Date(y, m - 1, d);

    this.profileUser = new UserDTO(
      raw.name,
      raw.surname_1,
      raw.surname_2 ?? '',
      raw.alias,
      birthDate,
      raw.email,
      raw.password,
    );

    try {
      await this.userService.updateUser(userId, this.profileUser);
      responseOK = true;
    } catch (error: any) {
      responseOK = false;
      errorResponse = error.error;
      this.sharedService.errorLog(errorResponse);
    }

    await this.sharedService.managementToast(
      'profileFeedback',
      responseOK,
      errorResponse,
    );
  }
}
