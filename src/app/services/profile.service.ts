

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  // Fetch profile data
  getProfileData(): Observable<any> {
    return this.http.get('http://localhost:5000/api/v1/fur/users/myprofile').pipe(
      map((res: any) => {
        console.log('Profile data fetched:', res.user); // Log fetched data
        return res.user;
      }),
      catchError((error) => {
        console.error('Error fetching profile data:', error);
        return of(null);
      })
    );
  }

  // Update profile data
  updateProfileData(workshop: any): Observable<any> {
    return this.http.patch('http://localhost:5000/api/v1/fur/workshops/updateworkshop', workshop).pipe(
      map((res: any) => {
        console.log('Profile updated successfully:', res);
        return res;
      }),
      catchError((error) => {
        console.error('Error updating profile data:', error);
        return of(null);
      })
    );
  }
}
