import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateSusEvaluationPayload, SusStats } from '../models/sus-evaluation.model';

const BASE_URL = `${environment.apiUrl}/sus-evaluations`;

@Injectable({ providedIn: 'root' })
export class SusEvaluationService {
  constructor(private readonly http: HttpClient) {}

  submit(payload: CreateSusEvaluationPayload): Observable<unknown> {
    return this.http.post(BASE_URL, payload);
  }

  getStats(): Observable<SusStats> {
    return this.http.get<SusStats>(`${BASE_URL}/stats`);
  }
}
