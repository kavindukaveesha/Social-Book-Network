import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {AuthenticationService} from '../../services/services/authentication.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit {
  activationForm: FormGroup;  // Form group for verification code input
  isSubmitting = false;  // Loading state for activation process
  showError = false;  // Flag to show validation errors
  email = "user@example.com";  // Placeholder email (should be dynamically assigned)
  resendTimer = 30;  // Countdown timer for resending the verification code
  interval: any;  // Interval reference for countdown
  errorMsg: string[] = [];  // Stores error messages

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) {
    // Initialize the form with 6-digit input fields
    this.activationForm = this.fb.group({
      digit0: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit1: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit2: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit3: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit4: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit5: ['', [Validators.required, Validators.pattern('[0-9]')]]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.email = params.get('email') || 'Unknown';
    });
    // Start countdown for resending the code
    this.startResendTimer();

  }

  /**
   * Handles account activation by verifying the entered code.
   */
  activateAccount() {
    if (this.activationForm.valid) {
      this.isSubmitting = true;
      const token = Object.values(this.activationForm.value).join(''); // Combine input values into one string
      this.confirmAccount(token);  // Call API to confirm activation
    } else {
      this.showError = true;  // Show validation error if the form is invalid
    }
  }

  /**
   * Moves cursor automatically between OTP input fields.
   * @param event - Keyup event from input field.
   * @param index - Index of the current input field.
   */
  onCodeChange(event: any, index: number) {
    const input = event.target;

    // Move to the next field on valid input
    if (input.value.length === 1 && index < 5) {
      input.nextElementSibling?.focus();
    }
    // Move back on backspace key
    else if (event.key === 'Backspace' && index > 0) {
      input.previousElementSibling?.focus();
    }
  }

  /**
   * Handles pasting a full OTP code into the input fields.
   * @param event - Paste event.
   */
  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text') || '';

    // Validate and distribute pasted values
    if (pasteData.length === 6 && /^[0-9]+$/.test(pasteData)) {
      [...pasteData].forEach((char, i) => {
        const control = this.activationForm.get(`digit${i}`);
        if (control) control.setValue(char);
      });
    }
  }

  /**
   * Checks if a digit input field is invalid.
   * @param index - Index of the input field.
   * @returns Boolean indicating if the field is invalid.
   */
  isDigitInvalid(index: number): boolean {
    const control = this.activationForm.controls[`digit${index}`];
    return control.invalid && control.touched;
  }

  /**
   * Handles resending the activation code.
   */
  resendCode() {
    this.resendTimer = 30;  // Reset timer
    this.startResendTimer();  // Restart countdown
  }

  /**
   * Starts the countdown timer for resending the code.
   */
  startResendTimer() {
    if (this.interval) clearInterval(this.interval);  // Clear any existing timer

    this.interval = setInterval(() => {
      if (this.resendTimer > 0) {
        this.resendTimer--;  // Decrement timer
      } else {
        clearInterval(this.interval);  // Stop timer when it reaches 0
      }
    }, 1000);
  }

  /**
   * Calls API to confirm account activation.
   * @param token - The 6-digit activation code entered by the user.
   */
  private confirmAccount(token: string) {
    this.authService.confirm({ token }).subscribe({
      next: () => {
        this.toastr.success('Your account has been successfully activated.\nNow you can proceed to login');
        this.isSubmitting = true;
        this.redirectToLogin();  // Navigate to login page after successful activation
      },
      error: (error: { error: { validationErrors: string[]; errorMsg: any; }; }) => {
        this.isSubmitting = false;
        this.errorMsg = [];

        // Handle validation errors or general error message
        if (error.error?.validationErrors) {
          this.errorMsg = error.error.validationErrors;
        } else {
          this.errorMsg.push(error.error?.errorMsg || 'Account Activation Failed');
        }

        this.toastr.error(this.errorMsg[0]);  // Show error message
      },
      complete: () => {
        this.isSubmitting = false;  // Reset submitting state
      }
    });
  }

  /**
   * Redirects user to the login page.
   */
  redirectToLogin() {
    this.router.navigate(['auth/login']);
  }
}
