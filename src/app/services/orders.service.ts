import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  apiAllOrders: string = 'http://localhost:5000/api/v1/fur/workshop/getorders';
  apiPendingOrders: string =
    'http://localhost:5000/api/v1/fur/workshop/pendingOrders';
  apiShippedOrders: string =
    'http://localhost:5000/api/v1/fur/workshop/shippedOrders';
  apiUpdateOrders: string =
    'http://localhost:5000/api/v1/fur/workshop/updateOrders';
  apiCancelOrders: string =
    'http://localhost:5000/api/v1/fur/workshop/cancelProduct';

  constructor(private http: HttpClient) {}

  allOrders!: any[];
  id: string = '66d87cbeb4d55d64579e20cc';
  getAllOrders(): Observable<any> {
    return this.http.get<any>(this.apiAllOrders);
  }

  getPendingOrders(): Observable<any> {
    return this.http.get<any>(this.apiPendingOrders).pipe(
      catchError((error) => {
        console.error('Error fetching shipped orders:', error);
        return throwError(error);
      })
    );
  }

  getShippedOrders(): Observable<any> {
    return this.http.get<any>(this.apiShippedOrders).pipe(
      catchError((error) => {
        console.error('Error fetching shipped orders:', error);
        return throwError(error);
      })
    );
  }

  updateOrderStatus(
    productId: string,
    orderId: string,
    color: string
  ): Observable<any> {
    return this.http.put<any>(this.apiUpdateOrders, {
      productId,
      orderId,
      color,
    });
  }

  cancelOrder(
    productId: string,
    orderId: string,
    color: string
  ): Observable<any> {
    const body = { productId, orderId, color };
    return this.http.delete<any>(this.apiCancelOrders, { body });
  }
}
