import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginReq, LoginResp, RegisterReq, RegisterResp } from '@core/model/auth.model';
import { ApiErrorService } from '@service/api-error.service';
import { ApiService } from '@service/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public _loginSubject = new Subject<boolean>();

    constructor(
        private router: Router,
        private apiService: ApiService,
        private spinner: NgxSpinnerService,
        private apiErrorService: ApiErrorService,
    ) { }

    public login(data: LoginReq): void {
        this.spinner.show();

        this.apiService.postLogin(data).subscribe({
            next: (resp: LoginResp) => {
                this.spinner.hide();
                sessionStorage.setItem('authToken', resp.access);
                sessionStorage.setItem('refresh', resp.refresh);
                sessionStorage.setItem('userType', resp.usertype);
                sessionStorage.setItem('user', JSON.stringify(resp));
                this.router.navigateByUrl('/dashboard');
                this._loginSubject.next(true);
            },
            error: () => {
                this.spinner.hide();
                this.apiErrorService.toastMessage('Error', 'Failed to authenticate', 'Failed')
            }
        });
    }

    public registerUser(data: RegisterReq): Observable<RegisterResp> {
        return this.apiService.postRegisterUser(data);
    }

    public logout(): void {
        sessionStorage.clear();
        this.router.navigateByUrl('/login');
    }

    public getUserType(): string {
        return sessionStorage.getItem('userType') || 'Guest';
    }

    public hasToken(): boolean {
        return sessionStorage.getItem('authToken') != null;
    }

    public getUserName(): string {
        const user = JSON.parse(sessionStorage.getItem('user') ? sessionStorage.getItem('user') : null);
        const userName = (user.firstname && user.lastname) ? `${user.firstname} ${user.lastname}` : 'Guest';
        return userName;
    }

}