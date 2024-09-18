import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getProfileData(): Observable<any> {
    return this.http
      .get('http://localhost:5000/api/v1/fur/users/myprofile')
      .pipe(
        map((res: any) => res.user),
        catchError((error) => {
          console.error('Error fetching profile data:', error);
          // Handle error gracefully, e.g., return default value or show error message
          return of(null);
        })
      );
  }
}
