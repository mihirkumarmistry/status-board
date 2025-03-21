import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OtpReq, OtpResp } from '@core/model/auth.model';
import { AuthService } from '@core/services/auth.service';
import { ApiErrorService } from '@service/api-error.service';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, NgxSpinnerComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent implements OnInit {
  protected loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private apiErrorService: ApiErrorService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  protected onSubmit(): void {
    if (this.loginForm.valid) {
      // Input sanitization
      const value = this.loginForm.value;
      const param: OtpReq = {
        email: value.email,
        password: value.password
      };

      this.spinner.show();

      // Call Generate Otp
      this.authService.generateOtp(param).subscribe({
        next: (resp: OtpResp) => {
          console.log(resp.message);
          this.spinner.hide();
          sessionStorage.setItem('email', param.email);
        },
        error: () => {
          this.spinner.hide();
          this.apiErrorService.toastMessage('Error', 'Error!', 'Failed to sign-in!');
        }
      });
    }
  }
}
