import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserProfile } from '../models/user.model';

const BASE_URL = `${environment.apiUrl}/users`;

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  dni?: string;
  birthDate?: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private readonly http: HttpClient) {}

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${BASE_URL}/me`);
  }

  updateProfile(payload: UpdateProfilePayload): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${BASE_URL}/me`, payload);
  }

  updateAvatar(file: File): Observable<UserProfile> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<UserProfile>(`${BASE_URL}/me/avatar`, formData);
  }
}
