import { Component, EventEmitter, Output } from '@angular/core';
import { LoginService } from '../login.service';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NonNullableFormBuilder } from '@angular/forms';
import { ConstantsService } from '../constants.service';
import { ResponseLogin } from '../response-login';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrentUser } from '../current-user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  maxLengthUsername = this.constants.MAX_LENGTH_USERNAME;
  maxLengthPassword = this.constants.MAX_LENGTH_PASSWORD;

  hide = true;
  requestDone = false;

  loginForm = this.formBuilder.group({
    username: '',
    password: ''
  });

  constructor(private loginService: LoginService, private http: HttpClient, private route: ActivatedRoute, private formBuilder: NonNullableFormBuilder, private constants: ConstantsService, private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    const request = this.loginService.currentUserRequest(err => this.callbackErrorCurrentUser(err), () => this.requestDone = true);
    request.subscribe(data => this.callbackResponseCurrentUser(data));
  }

  private callbackResponseCurrentUser(data: CurrentUser) {
    if (typeof this.loginService.processResponseCurrentUser(data) === "string") {
      this.snackBar.open(this.constants.LOGGED_IN_MESSAGE);
    }
  }

  private callbackErrorCurrentUser(error: HttpErrorResponse) {
    return this.loginService.handleError(error);
  }

  private callbackResponseLogin(data: HttpResponse<string>) {
    const response = this.loginService.processResponseLogin(data);

    switch (response) {
      case ResponseLogin.BAD_CREDENTIALS: {
        this.displayError(this.constants.BAD_CREDENTIALS_MESSAGE);
        break;
      }
      case ResponseLogin.SUCCESS: {
        this.snackBar.open(this.constants.LOGGED_IN_MESSAGE);
        break;
      }
      case ResponseLogin.ERROR: {
        this.displayError(this.constants.ERROR_MESSAGE);
        break;
      }
    }
  }

  private callbackErrorLogin(error: HttpErrorResponse) {
    this.displayError(this.constants.ERROR_MESSAGE);
    return this.loginService.handleError(error);
  }

  onSubmit() {
    const request = this.loginService.authenticateRequest(this.loginForm.getRawValue(), (err => this.callbackErrorLogin(err)), () => null);
    request.subscribe(data => this.callbackResponseLogin(data));
  }

  private displayError(message: string) {
    this.snackBar.open(message);
  }

}