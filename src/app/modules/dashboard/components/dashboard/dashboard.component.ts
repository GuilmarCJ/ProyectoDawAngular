import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  userData: any;
  isMenuCollapsed = signal(false);
  activeSection = signal('materiales');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const savedData = localStorage.getItem('userData');
    this.userData = savedData ? JSON.parse(savedData) : {};
    
    if (!this.userData.nombre) {
      this.router.navigate(['/login']);
    }
  }

  toggleMenu() {
    this.isMenuCollapsed.set(!this.isMenuCollapsed());
  }

  setActiveSection(section: string) {
    this.activeSection.set(section);
  }

  logout() {
    this.authService.logout();
  }
}