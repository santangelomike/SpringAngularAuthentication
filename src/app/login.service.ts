import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize, Observable, ObservableInput, retry, Subject, throwError } from 'rxjs';
import { ConstantsService } from './constants.service';
import { CurrentUser } from './current-user';
import { ResponseLogin } from './response-login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // we aren't sending json objects for login and logout, that's why we need to change the content type
  private headers = new HttpHeaders().set(
    'Content-Type',
    'application/x-www-form-urlencoded;'
  );

  private authenticated = new Subject<boolean>();
  authenticatedObservable$ = this.authenticated.asObservable();

  constructor(private http: HttpClient, private constants: ConstantsService) { }

  private castMapToQueryString(map: { [param: string]: string }) {
    return new HttpParams({ fromObject: map }).toString();
  }

  authenticateRequest(credentials: string | { [param: string]: string }, callbackError: { (error: HttpErrorResponse): Observable<never>; (err: any, caught: Observable<HttpResponse<string>>): ObservableInput<any>; }, callbackFinalize: () => void): Observable<HttpResponse<string>> {
    const credentialsString: string = typeof credentials === "string" ? credentials : this.castMapToQueryString(credentials); 
    return this.http.post(
      this.constants.API_PATH_LOGIN, credentialsString, { headers: this.headers, observe: 'response', responseType: "text" }).pipe(retry(1), catchError(callbackError), finalize(callbackFinalize));
  }

  logoutRequest(callbackError: { (error: HttpErrorResponse): Observable<never>; (err: any, caught: Observable<HttpResponse<string>>): ObservableInput<any>; }, callbackFinalize: () => void): Observable<HttpResponse<string>> {
    return this.http.post(
      this.constants.API_PATH_LOGOUT, null, { headers: this.headers, observe: 'response', responseType: "text" }).pipe(retry(1), catchError(callbackError), finalize(callbackFinalize));
  }

  currentUserRequest(callbackError: { (error: HttpErrorResponse): Observable<never>; (err: any, caught: Observable<CurrentUser>): ObservableInput<any>; }, callbackFinalize: () => void): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(this.constants.API_PATH_CURRENT_USER).pipe(catchError(callbackError), finalize(callbackFinalize));
  }

  handleError(error: HttpErrorResponse) {
    return this.constants.handleError(error);
  }

  processResponseCurrentUser(data: CurrentUser): string | boolean {
    if (data != null) {
      this.authenticated.next(true);
      return data.name;
    }
    this.authenticated.next(false);
    return false;
  }

  processResponseLogin(data: HttpResponse<string>): ResponseLogin {
    if (data != null && data.url != null) {
      const parsed = new URL(data.url);
      if (parsed.pathname == this.constants.API_PATH_LOGIN) {
        if (parsed.search == this.constants.API_REDIRECT_QUERY_PARAM_BAD_CREDENTIALS) {
          return ResponseLogin.BAD_CREDENTIALS;
        }
      }
      else if (parsed.pathname == this.constants.API_REDIRECT_PATH_SUCCESSFUL_LOGIN) {
        this.authenticated.next(true);
        return ResponseLogin.SUCCESS;
      }
    }
    return ResponseLogin.ERROR;
  }

  processResponseLogout(data: HttpResponse<string>): ResponseLogin {
    if (data != null && data.url != null) {
      const parsed = new URL(data.url);
      if (parsed.pathname == this.constants.API_PATH_LOGIN && parsed.search == this.constants.API_REDIRECT_QUERY_PARAM_LOGOUT) {
        this.authenticated.next(false);
        return ResponseLogin.LOGOUT;
      }
    }
    return ResponseLogin.ERROR;
  }
}
