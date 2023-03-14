import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConstantsService } from '../constants.service';
import { CurrentUser } from '../current-user';
import { RegisterError } from '../register-error';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private formBuilder: FormBuilder, private constants: ConstantsService, private registerService: RegisterService, private snackBar: MatSnackBar) { }

  maxLengthUsername = this.constants.MAX_LENGTH_USERNAME;
  maxLengthPassword = this.constants.MAX_LENGTH_PASSWORD;

  hidePassword = true;
  hidePasswordConfirm = true;

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');

    return password && passwordConfirm && password.value != passwordConfirm.value ? { passwordMatch: false } : null;
  };

  registerForm = this.formBuilder.group({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(this.maxLengthUsername)] }),
    password: new FormControl('', { nonNullable: true, validators: Validators.maxLength(this.maxLengthPassword) }),
    passwordConfirm: new FormControl('', { nonNullable: true, validators: Validators.maxLength(this.maxLengthPassword) })
  }, { validators: this.passwordMatchValidator });

  get username() { return this.registerForm.get('username'); }

  private callbackErrorRegister(error: HttpErrorResponse) {
    const registerError = this.registerService.parseError(error);
    if (registerError == RegisterError.ERROR_USERNAME_TAKEN) {
      this.snackBar.open(this.constants.ERROR_USERNAME_TAKEN);
    }
    else {
      this.snackBar.open(this.constants.ERROR_MESSAGE);
    }
    return this.registerService.handleError(error);
  }

  private callbackResponseRegister(data: HttpResponse<CurrentUser>) {
    if (this.registerService.processRegister(data)) {
      this.snackBar.open(this.constants.REGISTERED_MESSAGE);
    }
    else {
      this.snackBar.open(this.constants.ERROR_MESSAGE);
    }
  }

  onSubmit() {
    const request = this.registerService.registerRequest(this.registerForm.getRawValue(), error => this.callbackErrorRegister(error), () => null);
    request.subscribe(data => this.callbackResponseRegister(data));
  }
}
