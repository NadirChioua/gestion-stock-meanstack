import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  _id: string;
  nom: string;
  description: string;
  prix: number;
  quantite: number;
  sku: string;
  categorie: string;
  seuilMinimum: number;
  actif: boolean;
  stockFaible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductResponse {
  success: boolean;
  message?: string;
  data: {
    products: Product[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalProducts: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface SingleProductResponse {
  success: boolean;
  message?: string;
  data: {
    product: Product;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient) {}

  getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categorie?: string;
    stockFaible?: boolean;
  }): Observable<ProductResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.categorie) httpParams = httpParams.set('categorie', params.categorie);
      if (params.stockFaible) httpParams = httpParams.set('stockFaible', 'true');
    }

    return this.http.get<ProductResponse>(this.apiUrl, { params: httpParams });
  }

  getProduct(id: string): Observable<SingleProductResponse> {
    return this.http.get<SingleProductResponse>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<SingleProductResponse> {
    return this.http.post<SingleProductResponse>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<SingleProductResponse> {
    return this.http.put<SingleProductResponse>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<SingleProductResponse> {
    return this.http.delete<SingleProductResponse>(`${this.apiUrl}/${id}`);
  }

  getProductStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/overview`);
  }
}

