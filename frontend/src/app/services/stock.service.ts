import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StockMovement {
  _id: string;
  produitId: {
    _id: string;
    nom: string;
    sku: string;
    categorie: string;
  };
  typeMouvement: 'entrée' | 'sortie' | 'ajustement' | 'retour';
  quantiteMouvement: number;
  quantiteAvant: number;
  quantiteApres: number;
  motif?: string;
  utilisateur: {
    _id: string;
    nom: string;
    email: string;
  };
  numeroCommande?: string;
  fournisseur?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockResponse {
  success: boolean;
  message?: string;
  data: {
    movements: StockMovement[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalMovements: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface SingleStockResponse {
  success: boolean;
  message?: string;
  data: {
    movement: StockMovement;
  };
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = 'http://localhost:5000/api/stock';

  constructor(private http: HttpClient) {}

  getMovements(params?: {
    page?: number;
    limit?: number;
    produitId?: string;
    typeMouvement?: string;
    dateDebut?: string;
    dateFin?: string;
  }): Observable<StockResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
      if (params.produitId) httpParams = httpParams.set('produitId', params.produitId);
      if (params.typeMouvement) httpParams = httpParams.set('typeMouvement', params.typeMouvement);
      if (params.dateDebut) httpParams = httpParams.set('dateDebut', params.dateDebut);
      if (params.dateFin) httpParams = httpParams.set('dateFin', params.dateFin);
    }

    return this.http.get<StockResponse>(this.apiUrl, { params: httpParams });
  }

  getMovement(id: string): Observable<SingleStockResponse> {
    return this.http.get<SingleStockResponse>(`${this.apiUrl}/${id}`);
  }

  createMovement(movement: {
    produitId: string;
    typeMouvement: string;
    quantiteMouvement: number;
    motif?: string;
    numeroCommande?: string;
    fournisseur?: string;
  }): Observable<SingleStockResponse> {
    return this.http.post<SingleStockResponse>(this.apiUrl, movement);
  }

  updateMovement(id: string, movement: Partial<StockMovement>): Observable<SingleStockResponse> {
    return this.http.put<SingleStockResponse>(`${this.apiUrl}/${id}`, movement);
  }

  getProductHistory(productId: string, limit?: number): Observable<{ success: boolean; data: { movements: StockMovement[] } }> {
    let httpParams = new HttpParams();
    if (limit) httpParams = httpParams.set('limit', limit.toString());
    
    return this.http.get<{ success: boolean; data: { movements: StockMovement[] } }>(
      `${this.apiUrl}/product/${productId}`,
      { params: httpParams }
    );
  }

  getMovementStats(dateDebut?: string, dateFin?: string): Observable<any> {
    let httpParams = new HttpParams();
    if (dateDebut) httpParams = httpParams.set('dateDebut', dateDebut);
    if (dateFin) httpParams = httpParams.set('dateFin', dateFin);
    
    return this.http.get(`${this.apiUrl}/stats/movements`, { params: httpParams });
  }
}

