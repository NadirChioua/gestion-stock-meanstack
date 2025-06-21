import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: string;
  nom: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Vérifier si un token existe au démarrage
    const token = this.getToken();
    if (token) {
      this.loadCurrentUser();
    }
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          if (response.success) {
            this.setToken(response.data.token);
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  login(email: string, motDePasse: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, motDePasse })
      .pipe(
        tap(response => {
          if (response.success) {
            this.setToken(response.data.token);
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Vérifier si le token n'est pas expiré
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private loadCurrentUser(): void {
    this.http.get<{ success: boolean; data: { user: User } }>(`${this.apiUrl}/me`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.currentUserSubject.next(response.data.user);
          }
        },
        error: () => {
          this.logout();
        }
      });
  }
}

