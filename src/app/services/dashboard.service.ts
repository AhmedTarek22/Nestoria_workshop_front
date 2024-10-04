import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  allDetails!: any[];

  apiAllDetails: string = 'http://localhost:5000/api/v1/fur/workshop/getDashboard';

  constructor(private http: HttpClient) { }

  getAllDetails(): Observable<any> {
    return this.http.get<any>(this.apiAllDetails).pipe(
      catchError((error) => {
        console.error('Error fetching details dashboard:', error);
        return throwError(error);
      })
    );
  }
}
