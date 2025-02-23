import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule
import { Component } from '@angular/core';
import { AuthenticationRequest } from '../../services/models/authentication-request';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule  // Add HttpClientModule to imports
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authRequest: AuthenticationRequest = { email: '', password: '' };
  errorMsg: Array<string> = [];
  backgroundImageUrl = 'assets/login.jpeg';

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  login() {
    this.errorMsg = [];
    this.authService.authentication(this.authRequest).subscribe(
      {
        next: (res: any) => {
          localStorage.setItem('authToken', res.token);
          this.router.navigate(['/books']);
        },
        error: (err: any) => {
          console.error(err);
          this.errorMsg.push('Invalid credentials or an error occurred');
        }
      }
    );
  }

  register() {
    this.router.navigate(['register']);
  }
}
