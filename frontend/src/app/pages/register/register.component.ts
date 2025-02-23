// Core imports for Angular functionality
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services/authentication.service';
import { ImagePaths } from '../../coe/constants/image.constants';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  styleUrls: ['./register.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgClass,
    NgIf
  ]
})
export class RegisterComponent implements OnInit {
  // Form group for registration form controls
  registerForm!: FormGroup;
  // Flag for submission status
  isSubmitting = false;
  // Array to store error messages
  errorMsg: Array<string> = [];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthenticationService,
    private tokenService: TokenService
  ) {}

  // Initialize form on component init
  ngOnInit(): void {
    this.registerForm = this.initializeForm();
  }

  // Create form group with validations
  private initializeForm(): FormGroup {
    return this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Handle registration form submission
  register() {
    if (this.registerForm.invalid) {
      this.validateForm();
      return;
    }

    this.isSubmitting = true;
    this.errorMsg = [];

    // Create registration data from form values
    const registrationData = {
      firstname: this.registerForm.get('firstname')?.value,
      lastname: this.registerForm.get('lastname')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value
    };

    // Call registration service
    this.authService.register({ body: registrationData }).subscribe({
      next: (res) => {
        // Handle successful registration
        this.toastr.success('Registration successful');
        // Optional: Auto-login after registration
        // this.tokenService.token = res.token as string;
        this.router.navigate(['/auth/activate-account',this.registerForm.value.email]);
      },
      error: (error) => {
        this.isSubmitting = false;
        // Handle validation errors or general error message
        if (error.error?.validationErrors) {
          this.errorMsg = error.error.validationErrors;
        } else {
          this.errorMsg.push(error.error?.errorMsg || 'Registration failed');
        }
        this.toastr.error(this.errorMsg[0]);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  // Mark all form controls as touched to trigger validation display
  private validateForm() {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Navigate to login page
  login() {
    this.router.navigate(['/auth/login']);
  }

  protected readonly ImagePaths = ImagePaths;
}
