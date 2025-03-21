import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RegisterReq } from '@core/model/auth.model';
import { AuthService } from '@core/services/auth.service';
import { ApiErrorService } from '@service/api-error.service';
import { AppRoutes } from '@shared/routes/routes.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export default class RegisterComponent {
  protected appRoutes = AppRoutes;
  protected registerForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private apiErrorService: ApiErrorService,
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  protected onSubmit(): void {
    if (this.registerForm.valid) {
      // Imput sanitization
      let formData = this.registerForm.value;
      const param: RegisterReq = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        mobile: formData.mobile,
        email: formData.email,
        password: formData.password
      }
      // Call auth process 
      // On responce toggle to Otp Page
      this.authService.registerUser(param).subscribe({
        next: (resp) => {
          this.apiErrorService.toastMessage('Success', 'Success');
          this.router.navigateByUrl('/login');
          console.log('Success');
        },
        error: (error) => {
          this.apiErrorService.toastMessage('Error', 'Error!', 'Failed to create user!');
        }
      });
    }
  }
}
