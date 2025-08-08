import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AwsRoute53Service } from './services/aws-route53.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      width: 100vw;
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private awsService: AwsRoute53Service
  ) {}

  ngOnInit(): void {
    // Initialize AWS client if credentials are available (only in browser)
    if (typeof window !== 'undefined') {
      // Remove or comment out the following line if present:
      // const credentials = this.authService.getCredentials();
      if (this.authService.isAuthenticated()) {
        // Remove or comment out the following line if present:
        // this.awsService.initializeClient(credentials);
      }
    }
  }
}
