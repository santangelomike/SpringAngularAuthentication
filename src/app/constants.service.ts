import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor() { }

  ROUTE_HOME = "/";

  API_PATH_LOGIN = "/login";
  API_REDIRECT_QUERY_PARAM_BAD_CREDENTIALS = "?error";
  API_REDIRECT_QUERY_PARAM_LOGOUT = "?logout";
  API_REDIRECT_PATH_SUCCESSFUL_LOGIN = "/";

  API_PATH_LOGOUT = "/logout";
  API_PATH_CURRENT_USER = "/api/current-user";
  API_PATH_REGISTER = "/api/users";

  BAD_CREDENTIALS_MESSAGE = "Username or password is incorrect.";
  LOGOUT_MESSAGE = "Successfully logged out.";
  ERROR_MESSAGE = "An error has occured.";
  ERROR_BACKEND_MESSAGE = "Backend returned an error.";
  ERROR_USERNAME_TAKEN = "Username is already taken.";
  REGISTERED_MESSAGE = "Account successfully registered.";
  LOGGED_IN_MESSAGE = "Successfully logged in.";

  MAX_LENGTH_USERNAME = 50;
  MAX_LENGTH_PASSWORD = 500;

  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error(this.ERROR_MESSAGE, error.error);
    }
    else {
      console.error(this.ERROR_BACKEND_MESSAGE, error.status, error.error);
    }

    return throwError(() => new Error(this.ERROR_MESSAGE));
  }
}
