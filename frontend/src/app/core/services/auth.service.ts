import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, DIRECTOR_ROLES, User } from '../models/user.model';

const TOKEN_KEY = 'qk_access_token';
const USER_KEY = 'qk_user';

export interface RegisterResponse {
  message: string;
  email: string;
}

export interface MessageResponse {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSignal = signal<User | null>(this.restoreUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly isDirector = computed(() => {
    const user = this.currentUserSignal();
    return !!user && DIRECTOR_ROLES.includes(user.role);
  });

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  register(payload: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    dni: string;
    birthDate: string;
  }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${environment.apiUrl}/auth/register`, payload);
  }

  login(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(tap((response) => this.setSession(response)));
  }

  verifyEmail(token: string): Observable<AuthResponse> {
    return this.http
      .get<AuthResponse>(`${environment.apiUrl}/auth/verify-email`, { params: { token } })
      .pipe(tap((response) => this.setSession(response)));
  }

  resendVerification(email: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${environment.apiUrl}/auth/resend-verification`, { email });
  }

  forgotPassword(email: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${environment.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${environment.apiUrl}/auth/reset-password`, { token, newPassword });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(`${environment.apiUrl}/auth/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  updateCachedUser(partial: Partial<User>): void {
    const current = this.currentUserSignal();
    if (!current) return;

    const updated: User = { ...current, ...partial };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    this.currentUserSignal.set(updated);
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, response.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    this.currentUserSignal.set(response.user);
  }

  private restoreUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
