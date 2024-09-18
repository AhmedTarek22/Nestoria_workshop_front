import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Owner {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  workshopName: string;
  licenseNumber: string;
  avatarUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkshopProfileService {
  private apiUrl = 'http://localhost:5000/api/v1/fur/users/myprofile';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<Owner> {
    return this.http.get<Owner>(this.apiUrl);
  }

  updateProfile(profile: Owner): Observable<Owner> {
    return this.http.put<Owner>(this.apiUrl, profile);
  }
}
