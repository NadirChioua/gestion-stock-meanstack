import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Connexion</h2>
        <p class="subtitle">Gestion de Stock - MEAN Stack</p>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="credentials.email"
              required
              email
              #email="ngModel"
              class="form-control"
              [class.error]="email.invalid && email.touched"
            >
            <div class="error-message" *ngIf="email.invalid && email.touched">
              Email requis et valide
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="credentials.motDePasse"
              required
              minlength="6"
              #password="ngModel"
              class="form-control"
              [class.error]="password.invalid && password.touched"
            >
            <div class="error-message" *ngIf="password.invalid && password.touched">
              Mot de passe requis (minimum 6 caractères)
            </div>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            class="login-btn"
            [disabled]="loginForm.invalid || isLoading"
          >
            {{ isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <div class="register-link">
          <p>Pas encore de compte ? <a href="#" (click)="showRegister = !showRegister">S'inscrire</a></p>
        </div>

        <!-- Formulaire d'inscription -->
        <div class="register-form" *ngIf="showRegister">
          <h3>Inscription</h3>
          <form (ngSubmit)="onRegister()" #registerForm="ngForm">
            <div class="form-group">
              <label for="nom">Nom</label>
              <input
                type="text"
                id="nom"
                name="nom"
                [(ngModel)]="registerData.nom"
                required
                class="form-control"
              >
            </div>

            <div class="form-group">
              <label for="registerEmail">Email</label>
              <input
                type="email"
                id="registerEmail"
                name="registerEmail"
                [(ngModel)]="registerData.email"
                required
                email
                class="form-control"
              >
            </div>

            <div class="form-group">
              <label for="registerPassword">Mot de passe</label>
              <input
                type="password"
                id="registerPassword"
                name="registerPassword"
                [(ngModel)]="registerData.motDePasse"
                required
                minlength="6"
                class="form-control"
              >
            </div>

            <div class="form-group">
              <label for="role">Rôle</label>
              <select
                id="role"
                name="role"
                [(ngModel)]="registerData.role"
                class="form-control"
              >
                <option value="utilisateur">Utilisateur</option>
                <option value="gestionnaire">Gestionnaire</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            <button
              type="submit"
              class="register-btn"
              [disabled]="registerForm.invalid || isLoading"
            >
              {{ isLoading ? 'Inscription...' : 'S\'inscrire' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrl: './login.css'
})
export class LoginComponent {
  credentials = {
    email: '',
    motDePasse: ''
  };

  registerData = {
    nom: '',
    email: '',
    motDePasse: '',
    role: 'utilisateur'
  };

  showRegister = false;
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.credentials.email && this.credentials.motDePasse) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.credentials.email, this.credentials.motDePasse)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.success) {
              this.router.navigate(['/dashboard']);
            }
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Erreur de connexion';
          }
        });
    }
  }

  onRegister() {
    if (this.registerData.nom && this.registerData.email && this.registerData.motDePasse) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.register(this.registerData)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.success) {
              this.router.navigate(['/dashboard']);
            }
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Erreur d\'inscription';
          }
        });
    }
  }
}

