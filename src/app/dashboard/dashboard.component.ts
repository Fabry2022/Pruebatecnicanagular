import { Component, effect } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [MatCardModule, MatButtonModule, MatIconModule, MatToolbarModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    user: any = null;

    constructor(private authService: AuthService, private router: Router) {
        effect(() => {
            this.user = this.authService.currentUser();
            if (!this.user) {
                this.router.navigate(['/login']);
            }
        });
    }

    logout() {
        this.authService.logout();
    }
}
