import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApplicationFilters,
  ApplicationMetrics,
  ApplicationStatus,
  VolunteerApplication,
} from '../models/application.model';

const BASE_URL = `${environment.apiUrl}/applications`;

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  constructor(private readonly http: HttpClient) {}

  submitApplication(formData: FormData): Observable<VolunteerApplication> {
    return this.http.post<VolunteerApplication>(BASE_URL, formData);
  }

  findMine(): Observable<VolunteerApplication[]> {
    return this.http.get<VolunteerApplication[]>(`${BASE_URL}/me`);
  }

  findAll(filters: ApplicationFilters): Observable<VolunteerApplication[]> {
    let params = new HttpParams();
    if (filters.status) params = params.set('status', filters.status);
    if (filters.area) params = params.set('area', filters.area);
    if (filters.search) params = params.set('search', filters.search);

    return this.http.get<VolunteerApplication[]>(BASE_URL, { params });
  }

  findOne(id: string): Observable<VolunteerApplication> {
    return this.http.get<VolunteerApplication>(`${BASE_URL}/${id}`);
  }

  getCvSignedUrl(id: string): Observable<{ signedUrl: string; fileName: string }> {
    return this.http.get<{ signedUrl: string; fileName: string }>(`${BASE_URL}/${id}/cv`);
  }

  getMetrics(): Observable<ApplicationMetrics> {
    return this.http.get<ApplicationMetrics>(`${BASE_URL}/metrics`);
  }

  updateStatus(
    id: string,
    payload: { status: ApplicationStatus; feedback?: string },
  ): Observable<VolunteerApplication> {
    return this.http.patch<VolunteerApplication>(`${BASE_URL}/${id}/status`, payload);
  }
}
