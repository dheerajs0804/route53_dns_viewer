import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class LoginComponent {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  login(): void {
    this.isLoading = true;
    
    // Simulate loading time for better UX
    setTimeout(() => {
      this.authService.login();
      this.snackBar.open('Signed in successfully', 'Close', { 
        duration: 2000,
        panelClass: ['success-snackbar']
      });
      this.router.navigate(['/dns-viewer']);
      this.isLoading = false;
    }, 1000);
  }
}