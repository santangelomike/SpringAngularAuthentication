import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConstantsService } from './constants.service';
import { ResponseLogin } from './response-login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  authenticated: boolean = false;
  
  constructor(private http: HttpClient, private router: Router, private loginService: LoginService, private snackBar: MatSnackBar, private constants: ConstantsService) {
    
  }

  ngOnInit() {
    this.loginService.authenticatedObservable$.subscribe(authenticated => this.authenticated = authenticated);
  }

  private callbackErrorLogout(error: HttpErrorResponse) {
    this.snackBar.open(this.constants.ERROR_MESSAGE);
    return this.loginService.handleError(error);
  }

  private callbackResponseLogout(data: HttpResponse<string>) {
    const response = this.loginService.processResponseLogout(data);
    switch (response) {
      case ResponseLogin.LOGOUT: {
        this.snackBar.open(this.constants.LOGOUT_MESSAGE);
        this.router.navigate([this.constants.ROUTE_HOME]);
        break;
      }
      case ResponseLogin.ERROR: {
        this.snackBar.open(this.constants.ERROR_MESSAGE);
        break;
      }
    }
  }

  setAuthenticated(authenticated: boolean) {
    this.authenticated = authenticated;
  }

  logout() {
    const logoutRequest = this.loginService.logoutRequest(err => this.callbackErrorLogout(err), () => null);
    logoutRequest.subscribe(data => this.callbackResponseLogout(data));
  }
}