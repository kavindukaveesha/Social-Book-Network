// Core imports for Angular functionality
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationRequest } from '../../services/models/authentication-request';
import { AuthenticationService } from '../../services/services/authentication.service';
import {ImagePaths} from '../../coe/constants/image.constants';
import {HttpClientModule} from '@angular/common/http';
import {TokenService} from '../../services/token/token.service';
import {response} from 'express';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgClass,
    NgIf,
    HttpClientModule
  ]
})
export class LoginComponent implements OnInit {
  // Form group for login form controls
  loginForm!: FormGroup;
  // Flag for submission status
  isSubmitting = false;
  // Array to store error messages
  errorMsg: Array<string> = [];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthenticationService,
    private tokenService :TokenService
  ) {
    this.initializeForm();
  }

  // Initialize form on component init
  ngOnInit(): void {
    this.loginForm = this.initializeForm();
  }

  // Create form group with validations
  private initializeForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  // Handle login form submission
  login() {
    if (this.loginForm.invalid) {
      this.validateForm();
      return;
    }

    this.isSubmitting = true;
    this.errorMsg = [];

    // Create auth request from form values
    const authRequest: AuthenticationRequest = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };
    console.log(this.loginForm.get('email')?.value);
    console.log(this.loginForm.get('password')?.value);

    // Call authentication service and handle response
    this.authService.authentication({ body: authRequest }).subscribe({
      next: (res) => {
        //save the token
        this.tokenService.token = res.token as string;
        //success message
        this.toastr.success('Login successful');

        this.router.navigate(['/books']);
      },
      error: (error) => {
        this.isSubmitting = false;
        // Handle validation errors or general error message
        console.log(error)
        if (error.error?.validationErrors) {
          this.errorMsg = error.error.validationErrors;
        } else {
          this.errorMsg.push(error.error?.errorMsg || 'Login failed');
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
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Navigate to registration page
  register() {
    this.router.navigate(['/auth/register']);
  }

  protected readonly ImagePaths = ImagePaths;
}
