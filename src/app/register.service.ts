import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservableInput, retry, catchError, finalize } from 'rxjs';
import { ConstantsService } from './constants.service';
import { CurrentUser } from './current-user';
import { RegisterError } from './register-error';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient, private constants: ConstantsService) { }

  registerRequest(credentials: { [param: string]: string }, callbackError: (err: any, caught: Observable<HttpResponse<CurrentUser>>) => ObservableInput<any>, callbackFinalize: () => void): Observable<HttpResponse<CurrentUser>> { 
    return this.http.post<CurrentUser>(
      this.constants.API_PATH_REGISTER, credentials, { observe: 'response' }).pipe(catchError(callbackError), finalize(callbackFinalize));
  }

  processRegister(data: HttpResponse<CurrentUser>): boolean {
    if (data.status == 201) {
      return true;
    }
    return false;
  }

  parseError(error: HttpErrorResponse): RegisterError {
    if (error.status == 409) {
      return RegisterError.ERROR_USERNAME_TAKEN;
    }
    else {
      return RegisterError.ERROR_UNKNOWN;
    }
  }

  handleError(error: HttpErrorResponse) {
    return this.constants.handleError(error);
  }
}
