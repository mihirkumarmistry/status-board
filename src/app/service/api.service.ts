import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginReq, LoginResp, RegisterReq, RegisterResp } from '@core/model/auth.model';
import { ScheduleReq, ScheduleResp } from '@core/model/schedule.model';
import { environment } from '@environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly ApiUrl = `${environment.apiUrl}`;
  readonly NodeUrl = `${environment.nodeUrl}`;
  // readonly NodeUrl = `${environment.auNodeUrl}`;
  
  constructor(private http: HttpClient) { }

  readonly WebAPIs = {
    // Authentication and MFA
    Create: `${this.ApiUrl}/user/create/`,
    Login: `${this.ApiUrl}/user/login/`,
    Schedule: `${this.ApiUrl}/user/schedule`,
    Quickupdate: `${this.ApiUrl}/user/quickupdate`,
    Ping: `${this.ApiUrl}/user/ping`
  }

  // login User
  public postLogin(data: LoginReq): Observable<LoginResp> {
    return this.http.post<LoginResp>(this.WebAPIs.Login, data);
  }

  // Register User
  public postRegisterUser(data: RegisterReq): Observable<RegisterResp> {
    return this.http.post<RegisterReq>(this.WebAPIs.Create, data);
  }

  // Schedule User
  public getSchedule(): Observable<any> {
    return this.http.get<ScheduleResp[]>(this.WebAPIs.Schedule);
  }
  public postSchedule(data: ScheduleReq): Observable<ScheduleResp> {
    return this.http.post<ScheduleResp>(this.WebAPIs.Schedule, data);
  }
  public deleteSchedule(id: number): Observable<any> {
    return this.http.delete(`${this.WebAPIs.Schedule}?id=${id}`);
  }

  // Update message on NodeMCU
  public updateMessage(name: string, message: string) {
    debugger
    console.log(`${this.NodeUrl}/updateMessage?message=${message}&name=${name}`);
    this.http.get(`${this.NodeUrl}/updateMessage?message=${message}&name=${name}`)
      .subscribe(response => {
        console.log(response);
      });
  }

  public quickUpdate(message: string): Observable<any> {
    const params = new HttpParams().set('message', message);
    return this.http.post(this.WebAPIs.Quickupdate, {}, { params });
  }

  public pingScheduler(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.post(this.WebAPIs.Ping, {}, { params });
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
