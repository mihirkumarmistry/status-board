import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@core/model/api.model';
import { LoginReq, LoginResp, OtpReq, OtpResp, RegisterReq, RegisterResp } from '@core/model/auth.model';
import { environment } from '@environments/environment.prod';
import { Auth, AuthResp } from '@model/auth.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly ApiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) { }

  readonly WebAPIs = {
    // Authentication and MFA
    Otp: `${this.ApiUrl}/user/otp/generate/`,
    Login: `${this.ApiUrl}/user/login/`,

    // Register User
    Register: `${this.ApiUrl}/user/create/`
  }

  // Authentication and MFA
  public postOtp(data: OtpReq): Observable<OtpResp> {
    return this.http.post<OtpResp>(this.WebAPIs.Otp, data);
  }

  public postLogin(data: LoginReq): Observable<LoginResp> {
    return this.http.post<LoginResp>(this.WebAPIs.Login, data);
  }

  // Register User
  public postRegisterUser(data: RegisterReq): Observable<RegisterResp> {
    return this.http.post<RegisterReq>(this.WebAPIs.Register, data);
  }
  // remove Later
  public postAuth(data: Auth): Observable<ApiResponse<AuthResp>> {
    return this.http.post<ApiResponse<AuthResp>>(this.WebAPIs.Register, data);
  }

  // handle errors
  public handleErrors(error: any): void {
    if (error.status === 400) {
      console.error('Bad Request:', error.error?.message || 'Invalid input');
      alert('Bad Request: Please check your input.');
    } else if (error.status === 401) {
      console.error('Unauthorized:', error.error?.message || 'Unauthorized access');
      alert('Unauthorized: Please log in.');
    } else if (error.status === 403) {
      console.error('Forbidden:', error.error?.message || 'Access denied');
      alert('Forbidden: You do not have permission.');
    } else if (error.status === 404) {
      console.error('Not Found:', error.error?.message || 'Resource not found');
      alert('Not Found: The requested resource was not found.');
    } else if (error.status === 500) {
      console.error('Internal Server Error:', error.error?.message || 'Something went wrong');
      alert('Server Error: Please try again later.');
    } else {
      console.error('Unexpected Error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  }
}
