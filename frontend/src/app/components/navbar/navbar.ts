import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" *ngIf="currentUser">
      <div class="nav-container">
        <div class="nav-brand">
          <h2>Gestion de Stock</h2>
        </div>
        
        <div class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active">Tableau de bord</a>
          <a routerLink="/products" routerLinkActive="active">Produits</a>
          <a routerLink="/stock" routerLinkActive="active">Mouvements</a>
        </div>
        
        <div class="nav-user">
          <span class="user-info">{{ currentUser.nom }} ({{ currentUser.role }})</span>
          <button class="logout-btn" (click)="logout()">Déconnexion</button>
        </div>
      </div>
    </nav>
  `,
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

