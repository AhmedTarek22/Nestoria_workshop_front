import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ApiResponse {
  msg: string;
  workshopProducts: Product[];
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  quantity: number;
  color: string;
  category:string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = 'http://localhost:5000/api/v1/fur/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/myproducts`);
  }

  // addProduct(product: Product): Observable<any> {
  //   console.log(product)
  //   return this.http.post(this.apiUrl, product);
  // }
  addProduct(productData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, productData);
  }

  // updateProduct(_id: string, product: Product): Observable<any> {
  //   return this.http.patch(`${this.apiUrl}/${_id}`, product);
  // }
  updateProduct(_id: string, productData: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${_id}`, productData);
  }
  

  deleteProduct(_id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${_id}`);
  }
}

